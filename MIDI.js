// MIDI データを表すクラス
class MIDI {
  static HEADER_CHUNK_IDENTIFIER = "MThd"
  static HEADER_CHUNK_LENGTH = 6
  static TRACK_CHUNK_IDENTIFIER = "MTrk"

  constructor(midiBase64) {
    const midiHex = base64toHEX(midiBase64)

    try {
      // ヘッダチャンク
      this.headerChunk = {}

      // ヘッダチャンクを示す識別子"MThd"
      const headerChunkType = HEXToUTF16(midiHex.slice(0, 8))
      if (headerChunkType !== MIDI.HEADER_CHUNK_IDENTIFIER) {
        throw new Error("Header chunk identifier is invalid.")
      }
      this.headerChunk.chunkType = headerChunkType

      // ヘッダチャンクのデータ長
      const length = HEXtoDecimal(midiHex.slice(8, 16))
      if (length !== MIDI.HEADER_CHUNK_LENGTH) {
        throw new Error("Header chunk length is invalid.")
      }
      this.headerChunk.length = length

      // フォーマット（1 or 2 or 3）
      const format = HEXtoDecimal(midiHex.slice(16, 20))
      if (format !== 0) {
        throw new Error("MIDI file format is invalid.")
      }
      this.headerChunk.format = format

      // トラック数
      const numTracks = HEXtoDecimal(midiHex.slice(20, 24))
      if (numTracks !== 1) {
        throw new Error("Number of tracks is invalid.")
      }
      this.headerChunk.numTracks = numTracks

      // 時間単位（4分音符あたりの分解能）
      const division = HEXtoDecimal(midiHex.slice(24, 28))
      const MSB = parseInt(
        ("0000000000000000" + parseInt(division.toString(2)))
          .slice(-16).slice(0, 1), 2
      )
      if (MSB !== 0) {
        console.log(MSB)
        throw new Error("Division is invalid.")
      }
      this.headerChunk.division = division

      // トラックチャンク
      this.trackChunk = {}

      // トラックチャンクを示す識別子"MTrk"
      const trackChunkType = HEXToUTF16(midiHex.slice(28, 36))
      if (trackChunkType !== MIDI.TRACK_CHUNK_IDENTIFIER) {
        throw new Error("Track chunk identifier is invalid.")
      }
      this.trackChunk.chunkType = trackChunkType

      // トラックチャンクのデータ長
      const trackChunkLength = HEXtoDecimal(midiHex.slice(36, 44))
      this.trackChunk.length = trackChunkLength

      // データセクション（可変長）
      this.trackChunk.mtrkEvents = []

      const offset = 44
      let diff = 0
      let deltaTimeDiff = 0
      let endOfTrack = false

      while (!endOfTrack) {
        let mtrkEvent = {}
        // デルタタイム（次のイベントまでの時間）（可変長）
        let deltaTime = ""

        let endOfDeltaTime = false
        while (!endOfDeltaTime) {
          const dec = HEXtoDecimal(midiHex.slice(
            offset + diff + deltaTimeDiff,
            offset + diff + deltaTimeDiff + 2
          ))
          const byte = ("00000000" + parseInt(dec.toString(2))).slice(-8)

          let MSB = byte.slice(0, 1)
          let lower7bits = byte.slice(1, 8)

          deltaTime += lower7bits

          if (MSB === "0") {
            endOfDeltaTime = true
          } else {
            deltaTimeDiff += 2
          }
        }

        mtrkEvent.deltaTime = parseInt(deltaTime, 2)

        const eventType = midiHex.slice(offset + diff + deltaTimeDiff + 2, offset + diff + deltaTimeDiff + 4)
        switch (eventType) {
          case "80":
            mtrkEvent.eventType = "midi event"
            mtrkEvent.midiStatus = "note off"
            mtrkEvent.noteNumber = HEXtoDecimal(
              midiHex.slice(offset + diff + deltaTimeDiff + 4, offset + diff + deltaTimeDiff + 6)
            )
            mtrkEvent.velocity = HEXtoDecimal(
              midiHex.slice(offset + diff + deltaTimeDiff + 6, offset + diff + deltaTimeDiff + 8)
            )

            diff += 8
            break
          case "90":
            mtrkEvent.eventType = "midi event"
            mtrkEvent.midiStatus = "note on"
            mtrkEvent.noteNumber = HEXtoDecimal(
              midiHex.slice(offset + diff + deltaTimeDiff + 4, offset + diff + deltaTimeDiff + 6)
            )
            mtrkEvent.velocity = HEXtoDecimal(
              midiHex.slice(offset + diff + deltaTimeDiff + 6, offset + diff + deltaTimeDiff + 8)
            )

            diff += 8
            break
          case "FF":
            mtrkEvent.eventType = "meta event"
            // メタイベントの処理
            const metaEventType = midiHex.slice(offset + diff + deltaTimeDiff + 4, offset + diff + deltaTimeDiff + 6)
            switch (metaEventType) {
              case "03":
                mtrkEvent.metaEventType = "Sequence/Track Name"
                const length = HEXtoDecimal(
                  midiHex.slice(offset + diff + deltaTimeDiff + 6, offset + diff + deltaTimeDiff + 8)
                )
                mtrkEvent.length = length

                const sequenceName = HEXToUTF16(
                  midiHex.slice(offset + diff + deltaTimeDiff + 8, offset + diff + deltaTimeDiff + 8 + 2 * length)
                )
                mtrkEvent.sequenceName = sequenceName

                diff += 8 + 2 * length
                break
              case "58":
                mtrkEvent.metaEventType = "Time Signature"
                // FF 58 04 nn dd cc bb Time Signature の処理
                diff += 16
                break
              case "2F":
                mtrkEvent.metaEventType = "End of Track"
                // FF 2F 00 End of Track の処理
                endOfTrack = true
                break
            }
            break
          case "F0":
          case "F7":
            mtrkEvent.eventType = "sysex event"
            // システムエクスクルーシブイベントの処理
            diff += 9999 // TODO
            break
          default:
            // 例外処理
            throw new Error(`Event type ${eventType} is invalid.`)
        }
        this.trackChunk.mtrkEvents.push(mtrkEvent)
      }

      console.log("MIDI file is loaded.")

    } catch (e) {
      // 例外処理
      console.log(e.message)
    }
  }

  show() {
    return JSON.stringify(this, null, "  ")
  }
}
