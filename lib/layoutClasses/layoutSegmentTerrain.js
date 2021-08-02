const { LayoutSegmentElement } = require('./layoutSegmentElement')

class LayoutSegmentTerrain extends LayoutSegmentElement {
  color = '#888'

  constructor(x, y, width, height, color = '#888') {
    super(x, y, width, height)
    this.color = color
  }

  draw(context, layout, x, y) {
    const bs = layout.blockSize
    const px = (x + this.x) * bs
    const py = (y + this.y) * bs
    const pw = this.width * bs
    const ph = this.height * bs

    context.fillStyle = this.color
    context.fillRect(px, py, pw, ph)
  }
}

module.exports = LayoutSegmentTerrain
