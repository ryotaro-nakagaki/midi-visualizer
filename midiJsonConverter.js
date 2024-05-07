const NUM_MIDI_FILE_INPUT = 4
const NUM_AUDIO_FILE_INPUT = 1

// HTML の各 <input> 要素からファイルを取得
let files = []
for (let i = 1; i <= NUM_MIDI_FILE_INPUT; i++) {
  files.push(document.querySelector(`#midi-file-input-${i}`))
}
files.push(document.querySelector("#audio-file-input"))

// FileReader オブジェクトを用意
let readers = []
for (let i = 0; i < NUM_MIDI_FILE_INPUT + NUM_AUDIO_FILE_INPUT; i++) {
  readers[i] = new FileReader()
}

let MIDIs = []

try {
  for (let i = 0; i < readers.length; i++) {
    readers[i].addEventListener("load", () => {
      // Data URL を検証し、形式が正しければ MIDI を抽出
      // Data URL の例「data:audio/mid;base64,TVRo...」
      const dataURL = readers[i].result

      // Data URL のプレフィックス
      const prefix = dataURL.slice(0, 4)
      if (prefix !== "data") {
        throw new Error(`Data URL prefix ${prefix} is invalid.`)
      }

      // Data URL の MIME タイプ
      const mimeType = dataURL.slice(5, 14)
      if (mimeType !== "audio/mid") {
        throw new Error(`MIME type ${mimeType} is invalid.`)
      }

      // Data URL のエンコード
      const encode = dataURL.slice(15, 21)
      if (encode !== "base64") {
        throw new Error(`Encode ${encode} is invalid.`)
      }

      // Data URL のデータ部分（Base64形式）
      const midiBase64 = dataURL.slice(22)
      MIDIs[i] = new MIDI(midiBase64)

    }, false)
  }
} catch (e) {
  console.log(e.message)
}

for (let i = 0; i < files.length; i++) {
  // 各 <input> 要素のボタンクリック時にファイル読取を開始
  files[i].addEventListener("change", () => {
    // Data URL の例「data:audio/mid;base64,TVRo...」
    const dataURL = files[i].files[0]
    readers[i].readAsDataURL(dataURL)
  }, false)
}

// base64 を HEX に変換する関数
function base64toHEX(base64) {
  const raw = atob(base64)
  let HEX = ""
  for (i = 0; i < raw.length; i++) {
    var tmpHex = raw.charCodeAt(i).toString(16).toUpperCase()
    HEX += (tmpHex.length === 2 ? tmpHex : "0" + tmpHex)
  }
  return HEX
}

// HEX を UTF-16 に変換する関数
function HEXToUTF16(HEX) {
  let utf16 = ""
  for (let i = 0; i < HEX.length; i += 2) {
    utf16 += String.fromCharCode(parseInt(HEX.slice(i, i + 2), 16))
  }
  return utf16
}

// HEX を 10進数に変換する関数
function HEXtoDecimal(HEX) {
  return parseInt(HEX, 16)
}
