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

  draw(context2d, layout, continuous) {
    const bs = layout.blockSize

    const trackwidth = bs / 4
    const turn45straightlength = Math.round(bs / 6)
    const beziercorr = bs / 4

    context2d.fillStyle = TRACK_COLOR
    context2d.strokeStyle = TRACK_COLOR
    context2d.lineWidth = trackwidth
    context2d.beginPath()
    switch (this.type) {
      case 'ltturnout':
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(bs, bs / 2)
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, beziercorr,
          bs, 0)
        break
      case 'lbturnout':
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(bs, bs / 2)
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'rtturnout':
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(bs, bs / 2)
        context2d.moveTo(bs, bs / 2)
        context2d.lineTo(bs - turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'rbturnout':
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(bs, bs / 2)
        context2d.moveTo(bs, bs / 2)
        context2d.lineTo(bs - turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'tlturnout':
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, bs)
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'trturnout':
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, bs)
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'blturnout':
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, bs)
        context2d.moveTo(bs / 2, bs)
        context2d.lineTo(bs / 2, bs - turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'brturnout':
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, bs)
        context2d.moveTo(bs / 2, bs)
        context2d.lineTo(bs / 2, bs - turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          bs - beziercorr, beziercorr,
          bs, 0)
        break

      case 'slbrturnout':
        context2d.moveTo(0, 0)
        context2d.lineTo(bs, bs)
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'slblturnout':
        context2d.moveTo(0, 0)
        context2d.lineTo(bs, bs)
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'sltrturnout':
        context2d.moveTo(0, 0)
        context2d.lineTo(bs, bs)
        context2d.moveTo(bs / 2, bs)
        context2d.lineTo(bs / 2, bs - turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'sltlturnout':
        context2d.moveTo(0, 0)
        context2d.lineTo(bs, bs)
        context2d.moveTo(bs, bs / 2)
        context2d.lineTo(bs - turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'srbrturnout':
        context2d.moveTo(0, bs)
        context2d.lineTo(bs, 0)
        context2d.moveTo(bs, bs / 2)
        context2d.lineTo(bs - turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'srblturnout':
        context2d.moveTo(0, bs)
        context2d.lineTo(bs, 0)
        context2d.moveTo(bs / 2, 0)
        context2d.lineTo(bs / 2, turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'srtrturnout':
        context2d.moveTo(0, bs)
        context2d.lineTo(bs, 0)
        context2d.moveTo(0, bs / 2)
        context2d.lineTo(turn45straightlength, bs / 2)
        context2d.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, beziercorr,
          bs, 0)
        break
      case 'srtlturnout':
        context2d.moveTo(0, bs)
        context2d.lineTo(bs, 0)
        context2d.moveTo(bs / 2, bs)
        context2d.lineTo(bs / 2, bs - turn45straightlength)
        context2d.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          bs - beziercorr, beziercorr,
          bs, 0)
        break

    }
    context2d.stroke()

    if (!continuous) {
      context2d.strokeStyle = 'rgba(100, 100, 100, 0.5)'
      context2d.lineWidth = 1
      context2d.beginPath()
      context2d.rect(0, 0, bs, bs)
      context2d.stroke()
    }
  }
}

module.exports = LayoutSegmentTurnout
