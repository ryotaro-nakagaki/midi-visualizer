const minMidiNotesTime = Math.min(
  midiTracks[0][0].startTime,
  midiTracks[1][0].startTime
)
const maxMidiNotesTime = Math.max(
  midiTracks[0][midiTracks[0].length - 1].endTime,
  midiTracks[1][midiTracks[1].length - 1].endTime
)

let minMidiNotesNumber = 127
let maxMidiNoteNumber = 0
for (let i = 0; i < midiTracks[0].length; i++) {
  if (minMidiNotesNumber > midiTracks[0][i].noteNumber) {
    minMidiNotesNumber = midiTracks[0][i].noteNumber
  }
  if (maxMidiNoteNumber < midiTracks[0][i].noteNumber) {
    maxMidiNoteNumber = midiTracks[0][i].noteNumber
  }
}
for (let i = 0; i < midiTracks[1].length; i++) {
  if (minMidiNotesNumber > midiTracks[1][i].noteNumber) {
    minMidiNotesNumber = midiTracks[1][i].noteNumber
  }
  if (maxMidiNoteNumber < midiTracks[1][i].noteNumber) {
    maxMidiNoteNumber = midiTracks[1][i].noteNumber
  }
}

const bpm = 100
const division = 96
const renderingFrameRate = 40
const videoFrameRate = 40 // max rate for Twitter: 40
const dv = (1 / 60) * division * bpm / videoFrameRate
const playSpeed = 1 / 6
const resolution = 720 // max resolution for Twitter: 720
const coordinateXToPlay = resolution * (2 / 3)
const numPitchDisplay = maxMidiNoteNumber - minMidiNotesNumber + 1
const pixelSize = resolution / (numPitchDisplay + 2)
const cornerRadius = 0//pixelSize / 2
const dyToPlay = pixelSize / 4

// ログ出力
const numTotalFrame = Math.ceil(60 * maxMidiNotesTime * videoFrameRate / (division * bpm))
const timeOutput = Math.floor(numTotalFrame / renderingFrameRate / 60) + "m" + Math.floor((numTotalFrame / renderingFrameRate) % 60) + "s"
console.log(`numTotalFrame: ${numTotalFrame}`)
console.log(`timeOutput: ${timeOutput}`)

function setup() {
  createCanvas(resolution, resolution)

  stroke(BLACK)
  strokeCap(SQUARE) // ROUND, SQUARE, PROJECT
  strokeJoin(BEVEL) // MITER, BEVEL, ROUND
  strokeWeight(pixelSize / 2)
  rectMode(CORNER) // CENTER, CORNER

  frameRate(renderingFrameRate)
}

function draw() {
  if (frameCount == numTotalFrame) noLoop()

  background(GRAY)

  for (let midiNote of midiTracks[0]) {
    x0 = coordinateXToPlay + pixelSize * (midiNote.startTime - dv * frameCount) * playSpeed
    x1 = coordinateXToPlay + pixelSize * (midiNote.endTime - dv * frameCount) * playSpeed
    y = pixelSize * (maxMidiNoteNumber - midiNote.noteNumber + 1)
    w = x1 - x0

    if (coordinateXToPlay < x0 || x1 < 0) {
      continue
    }

    if (x0 < coordinateXToPlay && coordinateXToPlay < x1) {
      fill(WHITE)
      y += dyToPlay
    } else {
      fill(MAIN_COLOR)
    }
    rect(x0, y, w, pixelSize, cornerRadius, cornerRadius, cornerRadius, cornerRadius)
  }

  for (let midiNote of midiTracks[1]) {
    x0 = coordinateXToPlay + pixelSize * (midiNote.startTime - dv * frameCount) * playSpeed
    x1 = coordinateXToPlay + pixelSize * (midiNote.endTime - dv * frameCount) * playSpeed
    y = pixelSize * (maxMidiNoteNumber - midiNote.noteNumber + 1)
    w = x1 - x0

    if (coordinateXToPlay < x0 || x1 < 0) {
      continue
    }

    if (x0 < coordinateXToPlay && coordinateXToPlay < x1) {
      fill(WHITE)
      y += dyToPlay
    } else {
      fill(SUB_COLOR)
    }
    rect(x0, y, w, pixelSize, cornerRadius, cornerRadius, cornerRadius, cornerRadius)
  }

  // saveCanvas(`${frameCount}`, "png")
}

function keyTyped() {
  if (key === ' ') noLoop()
}