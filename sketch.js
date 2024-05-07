let params = {}
const numLoop = 2000
const ar = AR.W1_H1 // chooseRandomAR()

function setup() {
  // 作品タイトルを設定
  init("Untitled", false)

  // ここにdrawブロックから参照されるグローバル定数を定義する
  params.pixelArt = []
  for (let i = 0; i < numLoop; i++) {
    params.pixelArt[i] = {
      rotate: random(360),
      bitmap: random([
        // BITMAP.SMILE, BITMAP.VIDEO2, BITMAP.ERROR,
        BITMAP.CURSOR_NORMAL_SELECT, BITMAP.CURSOR_LINK_SELECT,
        BITMAP.CURSOR_BUSY,
        // BITMAP.INVADER_SQUID, BITMAP.INVADER_CRAB,
        // BITMAP.INVADER_OCTOPUS,
        // BITMAP.GLIDER, BITMAP.LIGHTWEIGHT_SPACESHIP,
        // BITMAP.MIDDLEWEIGHT_SPACESHIP, BITMAP.HEAVYWEIGHT_SPACESHIP,
        // BITMAP.SMILY_FACE, BITMAP.TEZOS, BITMAP.OMOCHISKY_LOGO
      ]),
      x: random(),
      y: random(),
      pixelSize: random(1 / 2, 1),
      strokeColor: popPalletColor({
        enableWhite: true,
        enableBlack: true,
        enableGrayColors: true,
        enableMainColor: false,
        enableAnalogousColors: false,
        enableComplementColor: false,
        enableTransp: true,
      }),
      fillColor: popPalletColor({
        enableWhite: false,
        enableBlack: false,
        enableGrayColors: false,
        enableMainColor: true,
        enableAnalogousColors: false,
        enableComplementColor: false,
        enableTransp: false,
      }),
      isVerticalStripeEnabled: dice(8),
      isHorizontalStripeEnabled: dice(8),
      isSlashEnabled: dice(8),
      isBackSlashEnabled: dice(8),
    }
  }

  params.sevenSegmentDisplay = []
  for (let i = 0; i < numLoop; i++) {
    params.sevenSegmentDisplay[i] = {
      rotate: random(360),
      x: random(),
      y: random(),
      digit: random([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
      scale: random(10, 50),
      strokeColor: popPalletColor({
        enableWhite: true,
        enableBlack: true,
        enableGrayColors: false,
        enableMainColor: false,
        enableAnalogousColors: false,
        enableComplementColor: false,
        enableTransp: false,
      }),
      fillColor: popPalletColor({
        enableWhite: true,
        enableBlack: true,
        enableGrayColors: true,
        enableMainColor: true,
        enableAnalogousColors: true,
        enableComplementColor: false,
        enableTransp: true,
      }),
    }
  }

  params.background = {
    bgColor: popPalletColor({
      enableWhite: false,
      enableBlack: true,
      enableGrayColors: false,
      enableMainColor: false,
      enableAnalogousColors: false,
      enableComplementColor: false,
      enableTransp: false,
    }),
    isGradientEnabled: false,
    isConcentrationLineEnabled: false,
    concentrationLineColor: TRANSP
  }

  params.frame = {
    fillColor: popPalletColor({
      enableWhite: false,
      enableBlack: true,
      enableGrayColors: false,
      enableMainColor: false,
      enableAnalogousColors: false,
      enableComplementColor: false,
      enableTransp: false,
    }),
    strokeColor: popPalletColor({
      enableWhite: false,
      enableBlack: true,
      enableGrayColors: false,
      enableMainColor: false,
      enableAnalogousColors: false,
      enableComplementColor: false,
      enableTransp: false,
    })
  }
}

function windowResized() { draw() }

function draw() {
  createCanvasByAR(ar)
  // createCanvasByResolution(RESOLUTION.TWITTER_PROFILE)

  FRAME_WIDTH = min(width, height) / 24

  {
    strokeCap(SQUARE) // ROUND, SQUARE, PROJECT
    strokeJoin(BEVEL) // MITER, BEVEL, ROUND
    strokeWeight(FRAME_WIDTH / 14)
    rectMode(CENTER) // CENTER, CORNERS
    textAlign(CENTER, CENTER)
  }

  {
    // 背景
    addBackground({
      bgColor: params.background.bgColor,
      isGradientEnabled: params.background.isGradientEnabled,
      isConcentrationLineEnabled: params.background.isConcentrationLineEnabled,
      concentrationLineColor: params.background.concentrationLineColor
    })

    // 前景
    addForeground()

    // 枠
    addFrame(
      params.frame.fillColor,
      params.frame.strokeColor,
      FRAME_WIDTH
    )

    // addSignature("Rayroot", Micro5Regular, BLACK)
    addPaperTexture({
      isDotEnabled: true,
      isFiberEnabled: true,
      isNoiseEnabled: true,
      isFadeEnabled: true,
      isUnevenEnabled: true,
      isFoldLineEnabled: true,
    })
    // fxpreview()
  }

  function addForeground() {
    for (let i = 0; i < numLoop; i++) {
      rotateCallback(params.pixelArt[i].rotate, () => {
        drawPixelArt({
          bitmap: params.pixelArt[i].bitmap,
          x: params.pixelArt[i].x * width,
          y: params.pixelArt[i].y * height,
          pixelSize: FRAME_WIDTH * params.pixelArt[i].pixelSize,
          strokeColor: params.pixelArt[i].strokeColor,
          fillColor: params.pixelArt[i].fillColor,
          isVerticalStripeEnabled: params.pixelArt[i].isVerticalStripeEnabled,
          isHorizontalStripeEnabled: params.pixelArt[i].isHorizontalStripeEnabled,
          isSlashEnabled: params.pixelArt[i].isSlashEnabled,
          isBackSlashEnabled: params.pixelArt[i].isBackSlashEnabled,
        })
      })

      // rotateCallback(params.sevenSegmentDisplay[i].rotate, () => {
      //   draw7SegDisp(
      //     params.sevenSegmentDisplay[i].x * width, params.sevenSegmentDisplay[i].y * height,
      //     params.sevenSegmentDisplay[i].digit, params.sevenSegmentDisplay[i].scale,
      //     params.sevenSegmentDisplay[i].strokeColor, params.sevenSegmentDisplay[i].fillColor
      //   )
      // })
    }
  }
}

function keyTyped() {
  if (key === 's') saveCanvas(TITLE + "_" + SEED, "png") // "png" or "jpg"
  if (key === 'g') saveGif(TITLE + "_" + SEED, 4 * 1 / getTargetFrameRate())
}