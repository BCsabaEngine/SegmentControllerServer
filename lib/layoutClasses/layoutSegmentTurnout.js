const { LayoutSegmentBlockElement } = require('./layoutSegmentElement')

const TRACK_COLOR = '#404040'

class LayoutSegmentTurnout extends LayoutSegmentBlockElement {
  type = ''

  static getTypeGroups() {
    return {

      ltturnout: 'Horizontal left to top',
      lbturnout: 'Horizontal left to bottom',
      rtturnout: 'Horizontal right to top',
      rbturnout: 'Horizontal right to bottom',

      tlturnout: 'Vertical top to left',
      trturnout: 'Vertical top to right',
      blturnout: 'Vertical bottom to left',
      brturnout: 'Vertical bottom to right',

      'Skew': {
        slbrturnout: 'Left skew from bottom to right',
        slblturnout: 'Left skew from bottom to left',
        sltrturnout: 'Left skew from top to right',
        sltlturnout: 'Left skew from top to left',
        srbrturnout: 'Right skew from bottom to right',
        srblturnout: 'Right skew from bottom to left',
        srtrturnout: 'Right skew from top to right',
        srtlturnout: 'Right skew from top to left',
      },

    }
  }

  static getTypes() {
    const groups = LayoutSegmentTurnout.getTypeGroups()

    const result = {}
    for (const group in groups)
      if (global.isObject(groups[group]))
        for (const groupobj in groups[group])
          result[groupobj] = groups[group][groupobj]
      else
        result[group] = groups[group]
    return result
  }

  constructor(x, y, type) {
    super(x, y)
    this.setType(type)
  }

  setType(type) { if (type in LayoutSegmentTurnout.getTypes()) this.type = type }

  drawToSegment(context, layout, segment) {
    const bs = layout.blockSize
    this.draw(context, layout, (segment.x + this.x) * bs, (segment.y + this.y) * bs, true)
  }

  draw(context, layout, x, y, continuous) {
    const bs = layout.blockSize

    const trackwidth = bs / 4
    const turn45straightlength = Math.round(bs / 6)
    const beziercorr = bs / 4

    context.fillStyle = TRACK_COLOR
    context.strokeStyle = TRACK_COLOR
    context.lineWidth = trackwidth
    context.setTransform(1, 0, 0, 1, x, y)
    context.beginPath()
    switch (this.type) {
      case 'ltturnout':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(0, bs / 2)
        context.lineTo(turn45straightlength, bs / 2)
        context.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, beziercorr,
          bs, 0)
        break
      case 'lbturnout':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(0, bs / 2)
        context.lineTo(turn45straightlength, bs / 2)
        context.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'rtturnout':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(bs, bs / 2)
        context.lineTo(bs - turn45straightlength, bs / 2)
        context.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'rbturnout':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(bs, bs / 2)
        context.lineTo(bs - turn45straightlength, bs / 2)
        context.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'tlturnout':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, turn45straightlength)
        context.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'trturnout':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, turn45straightlength)
        context.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'blturnout':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        context.moveTo(bs / 2, bs)
        context.lineTo(bs / 2, bs - turn45straightlength)
        context.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'brturnout':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        context.moveTo(bs / 2, bs)
        context.lineTo(bs / 2, bs - turn45straightlength)
        context.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          bs - beziercorr, beziercorr,
          bs, 0)
        break

      case 'slbrturnout':
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, turn45straightlength)
        context.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'slblturnout':
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        context.moveTo(0, bs / 2)
        context.lineTo(turn45straightlength, bs / 2)
        context.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'sltrturnout':
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        context.moveTo(bs / 2, bs)
        context.lineTo(bs / 2, bs - turn45straightlength)
        context.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'sltlturnout':
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        context.moveTo(bs, bs / 2)
        context.lineTo(bs - turn45straightlength, bs / 2)
        context.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'srbrturnout':
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        context.moveTo(bs, bs / 2)
        context.lineTo(bs - turn45straightlength, bs / 2)
        context.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'srblturnout':
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, turn45straightlength)
        context.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'srtrturnout':
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        context.moveTo(0, bs / 2)
        context.lineTo(turn45straightlength, bs / 2)
        context.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, beziercorr,
          bs, 0)
        break
      case 'srtlturnout':
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        context.moveTo(bs / 2, bs)
        context.lineTo(bs / 2, bs - turn45straightlength)
        context.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          bs - beziercorr, beziercorr,
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

    context.resetTransform()
  }
}

module.exports = LayoutSegmentTurnout
