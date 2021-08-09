const { LayoutSegmentBlockElement } = require('./layoutSegmentElement')

const TRACK_WIDTH = 8
const TRACK_COLOR = '#404040'

const degree45 = Math.PI / 4
const sin45 = Math.sin(degree45)
const cos45 = Math.cos(degree45)

class LayoutSegmentTrack extends LayoutSegmentBlockElement {
  type = ''

  static getTypes() {
    return {
      hline: 'Horizontal',
      vline: 'Vertical',

      rskew: 'Right skew',
      lskew: 'Left skew',

      tl90turn: 'Top-left 90° turn',
      tr90turn: 'Top-right 90° turn',
      bl90turn: 'Bottom-left 90° turn',
      br90turn: 'Bottom-right 90° turn',

      lu45turn: 'Left to top 45° turn',
    }
  }

  constructor(x, y, type) {
    super(x, y)
    this.setType(type)
  }

  setType(type) { if (type in LayoutSegmentTrack.getTypes()) this.type = type }

  drawToSegment(context, layout, segment) {
    const bs = layout.blockSize
    this.draw(context, layout, (segment.x + this.x) * bs, (segment.y + this.y) * bs, true)
  }

  draw(context, layout, x, y, continuous) {
    const bs = layout.blockSize

    context.fillStyle = TRACK_COLOR
    context.strokeStyle = TRACK_COLOR
    context.lineWidth = TRACK_WIDTH
    context.beginPath()
    switch (this.type) {
      case 'hline':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        break
      case 'vline':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        break

      case 'rskew':
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        break
      case 'lskew':
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        break

      case 'tl90turn':
        context.arc(bs, bs, bs / 2, Math.PI, 1.5 * Math.PI)
        break
      case 'tr90turn':
        context.arc(0, bs, bs / 2, 1.5 * Math.PI, 0)
        break
      case 'bl90turn':
        context.arc(bs, 0, bs / 2, 0.5 * Math.PI, Math.PI)
        break
      case 'br90turn':
        context.arc(0, 0, bs / 2, 0, 0.5 * Math.PI)
        break

      case 'lu45turn':
        const straightlength = bs / 6
        const bsqtr = bs / 4

        context.moveTo(bs, bs / 2)
        context.lineTo(0, bs / 2)
        context.lineTo(straightlength, bs / 2)
        context.bezierCurveTo(
          straightlength + bsqtr, bs / 2,
          bs - bsqtr, bsqtr,
          bs, 0)
        break

    }
    context.stroke()

    if (!continuous) {
      context.strokeStyle = 'rgba(100, 100, 100, 0.5)'
      context.lineWidth = 1
      context.beginPath()
      context.rect(0, 0, bs, bs)
      context.stroke()
    }
  }
}

module.exports = LayoutSegmentTrack
