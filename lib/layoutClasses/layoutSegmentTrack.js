const { LayoutSegmentBlockElement } = require('./layoutSegmentElement')

const TRACK_WIDTH = 8
const TRACK_COLOR = '#404040'

class LayoutSegmentTrack extends LayoutSegmentBlockElement {
  type = ''

  static getTypes() {
    return {
      hline: 'Horizontal',
      vline: 'Vertical',
      rskew: 'Right skew',
      lskew: 'Left skew',
      tlturn: 'Top-left turn',
      trturn: 'Top-right turn',
      blturn: 'Bottom-left turn',
      brturn: 'Bottom-right turn',
    }
  }

  setType(type) { if (type in LayoutSegmentTrack.getTypes()) this.type = type }

  drawToSegment(context, layout, segment) {
    const bs = layout.blockSize
    this.draw(context, layout, (segment.x + this.x) * bs, (segment.y + this.y) * bs)
  }

  draw(context, layout, x, y) {
    const bs = layout.blockSize

    context.fillStyle = TRACK_COLOR
    context.strokeStyle = TRACK_COLOR
    context.lineWidth = TRACK_WIDTH
    switch (this.type) {
      case 'hline':
        context.fillRect(x + 0, y + (bs - TRACK_WIDTH) / 2, bs, TRACK_WIDTH)
        break
      case 'vline':
        context.fillRect(x + (bs - TRACK_WIDTH) / 2, y + 0, TRACK_WIDTH, bs)
        break
      case 'rskew':
        context.beginPath()
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        context.stroke()
        break
      case 'lskew':
        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        context.stroke()
        break
      case 'tlturn':
        context.beginPath()
        context.arc(bs, bs, bs / 2, Math.PI, 1.5 * Math.PI)
        context.stroke()
        break
      case 'trturn':
        context.beginPath()
        context.arc(0, bs, bs / 2, 1.5 * Math.PI, 0)
        context.stroke()
        break
      case 'blturn':
        context.beginPath()
        context.arc(bs, 0, bs / 2, 0.5 * Math.PI, Math.PI)
        context.stroke()
        break
      case 'brturn':
        context.beginPath()
        context.arc(0, 0, bs / 2, 0, 0.5 * Math.PI)
        context.stroke()
        break
    }
  }
}

module.exports = LayoutSegmentTrack
