function translateCallback(x, y, callbackFuncion) {
  translate(x, y)
  callbackFuncion()
  translate(-x, -y)
}

function addBackground(bgColor, isGradientEnabled) {
  colorMode(HSB, 100)

  // 背景を単色で塗る
  background(bgColor)

  // グラデーションを追加する
  if (isGradientEnabled) {
    const img = createImage(width, height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        img.set(x, y, color(0, 0, 100 * (1 - y / height), 25))
      }
    }
    img.updatePixels()
    image(img, 0, 0)
  }
}