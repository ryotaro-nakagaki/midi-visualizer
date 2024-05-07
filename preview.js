function setup() {
  const canvasWidth = document.getElementById('sketch-holder').clientWidth
  const canvasHeight = canvasWidth * (9 / 16)
  const canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('sketch-holder')

  smooth()
  frameRate(24) // Cinematic

  stroke(BLACK)
  strokeCap(SQUARE) // ROUND, SQUARE, PROJECT
  strokeJoin(BEVEL) // MITER, BEVEL, ROUND
  strokeWeight(1)
  rectMode(CENTER) // CENTER, CORNERS
  // horizAlign: LEFT, CENTER, or RIGHT.
  // vertAlign: TOP, BOTTOM, CENTER, or BASELINE.
  textAlign(LEFT, TOP)
}

function windowResized() {
  const canvasWidth = document.getElementById('sketch-holder').clientWidth
  const canvasHeight = canvasWidth * 9 / 16
  resizeCanvas(canvasWidth, canvasHeight)
}

function draw() {
  addBackground(WHITE, true)
  addForeground()

  function addForeground() {
    if (MIDIs[0] !== undefined) {
      const midiNotes = getMidiNotesFromSMF(MIDIs[0])
      const endTime = midiNotes[midiNotes.length - 1].endTime

      for (let midiNote of midiNotes) {
        line(
          map(midiNote.startTime, 0, endTime, 0, width),
          map(midiNote.noteNumber, 0, 127, height, 0),
          map(midiNote.endTime, 0, endTime, 0, width),
          map(midiNote.noteNumber, 0, 127, height, 0)
        )
      }
    }
  }
}

function getMidiNotesFromSMF(SMF) {
  let midiEvents = []
  for (let mtrkEvent of SMF.trackChunk.mtrkEvents) {
    if (mtrkEvent.eventType === "midi event") {
      midiEvents.push(mtrkEvent)
    }
  }

  let midiNotes = []
  let tmpMidiNotes = []
  let sumDeltaTime = 0

  for (let midiEvent of midiEvents) {
    switch (midiEvent.midiStatus) {
      case "note on":
        sumDeltaTime += midiEvent.deltaTime
        tmpMidiNotes.push({
          startTime: sumDeltaTime,
          noteNumber: midiEvent.noteNumber,
          velocity: midiEvent.velocity
        })
        break
      case "note off":
        sumDeltaTime += midiEvent.deltaTime
        for (let i = 0; i < tmpMidiNotes.length; i++) {
          if (tmpMidiNotes[i].noteNumber === midiEvent.noteNumber) {
            tmpMidiNotes[i].endTime = sumDeltaTime
            midiNotes.push(tmpMidiNotes.splice(i, 1)[0])
          }
        }
    }
  }

  return midiNotes
}

document.querySelector("#play-btn").addEventListener("click", () => {
  // 再生
})