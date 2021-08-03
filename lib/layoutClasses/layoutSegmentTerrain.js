const Color = require('color')

const { LayoutSegmentElement } = require('./layoutSegmentElement')

class LayoutSegmentTerrain extends LayoutSegmentElement {
  color = '#888'
  text = ''

  constructor(x, y, width, height, color = '#888', text = '') {
    super(x, y, width, height)
    this.color = color
    this.text = text
  }

  drawText(context, layout, x, y) {
    if (!this.text) return

    const bs = layout.blockSize

    const textx = (x + this.x + this.width / 2) * bs
    const texty = (y + this.y + this.height / 2) * bs

    context.translate(textx, texty)
    context.fillStyle = Color(this.color).negate().lighten(0.66).hex()
    context.font = '18px Sans'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    if (this.width < this.height)
      context.rotate(-90 * Math.PI / 180)
    context.fillText(this.text, 0, 0)
    context.resetTransform()
  }
}

module.exports = LayoutSegmentTerrain
