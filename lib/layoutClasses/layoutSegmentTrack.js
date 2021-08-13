const { LayoutSegmentBlockElement } = require('./layoutSegmentElement')

const TRACK_WIDTH = 8
const TRACK_COLOR = '#404040'

class LayoutSegmentTrack extends LayoutSegmentBlockElement {
  type = ''

  static getTypeGroups() {
    return {
      hline: 'Horizontal',
      vline: 'Vertical',

      rskew: 'Right skew',
      lskew: 'Left skew',

      '90° turn': {
        br90turn: 'Bottom-right 90° turn',
        bl90turn: 'Bottom-left 90° turn',
        tl90turn: 'Top-left 90° turn',
        tr90turn: 'Top-right 90° turn',
      },

      '45° turn': {
        lt45turn: 'Left to top 45° turn',
        lb45turn: 'Left to bottom 45° turn',
        rt45turn: 'Right to top 45° turn',
        rb45turn: 'Right to bottom 45° turn',
        tl45turn: 'Top to left 45° turn',
        tr45turn: 'Top to right 45° turn',
        bl45turn: 'Bottom to left 45° turn',
        br45turn: 'Bottom to right 45° turn',
      },

      'Crossing': {
        hvcross: 'Horizontal + vertical',
        hlscross: 'Horizontal + left skew',
        hrscross: 'Horizontal + right skew',
        vlscross: 'Vertical + left skew',
        vrscross: 'Vertical + right skew',
        lsrscross: 'Left + right skew',
      },

      'Stop': {
        lstop: 'Left',
        rstop: 'Right',
        tstop: 'Top',
        bstop: 'Bottom',
      },

    }
  }

  static getTypes() {
    const groups = LayoutSegmentTrack.getTypeGroups()

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

  setType(type) { if (type in LayoutSegmentTrack.getTypes()) this.type = type }

  drawToSegment(context, layout) {
    const bs = layout.blockSize
    this.draw(context, layout, this.x * bs, this.y * bs, true)
  }

  draw(context, layout, x, y, continuous) {
    const bs = layout.blockSize

    const turn45straightlength = Math.round(bs / 6)
    const stopstraightlength = Math.round(bs * 3 / 4)
    const beziercorr = bs / 4

    context.fillStyle = TRACK_COLOR
    context.strokeStyle = TRACK_COLOR
    context.lineWidth = TRACK_WIDTH
    context.setTransform(1, 0, 0, 1, x, y)
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

      case 'lt45turn':
        context.moveTo(0, bs / 2)
        context.lineTo(turn45straightlength, bs / 2)
        context.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, beziercorr,
          bs, 0)
        break
      case 'lb45turn':
        context.moveTo(0, bs / 2)
        context.lineTo(turn45straightlength, bs / 2)
        context.bezierCurveTo(
          turn45straightlength + beziercorr, bs / 2,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'rt45turn':
        context.moveTo(bs, bs / 2)
        context.lineTo(bs - turn45straightlength, bs / 2)
        context.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'rb45turn':
        context.moveTo(bs, bs / 2)
        context.lineTo(bs - turn45straightlength, bs / 2)
        context.bezierCurveTo(
          bs - turn45straightlength - beziercorr, bs / 2,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'tl45turn':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, turn45straightlength)
        context.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          beziercorr, bs - beziercorr,
          0, bs)
        break
      case 'tr45turn':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, turn45straightlength)
        context.bezierCurveTo(
          bs / 2, turn45straightlength + beziercorr,
          bs - beziercorr, bs - beziercorr,
          bs, bs)
        break
      case 'bl45turn':
        context.moveTo(bs / 2, bs)
        context.lineTo(bs / 2, bs - turn45straightlength)
        context.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          beziercorr, beziercorr,
          0, 0)
        break
      case 'br45turn':
        context.moveTo(bs / 2, bs)
        context.lineTo(bs / 2, bs - turn45straightlength)
        context.bezierCurveTo(
          bs / 2, bs - turn45straightlength - beziercorr,
          bs - beziercorr, beziercorr,
          bs, 0)
        break

      case 'hvcross':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        break
      case 'hlscross':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        break
      case 'hrscross':
        context.moveTo(0, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        break
      case 'vlscross':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        break
      case 'vrscross':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, bs)
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        break
      case 'lsrscross':
        context.moveTo(0, 0)
        context.lineTo(bs, bs)
        context.moveTo(0, bs)
        context.lineTo(bs, 0)
        break

      case 'lstop':
        context.moveTo(bs - stopstraightlength, bs / 2)
        context.lineTo(bs, bs / 2)
        context.moveTo(bs - stopstraightlength, bs / 4)
        context.lineTo(bs - stopstraightlength, bs - bs / 4)
        break
      case 'rstop':
        context.moveTo(0, bs / 2)
        context.lineTo(stopstraightlength, bs / 2)
        context.moveTo(stopstraightlength, bs / 4)
        context.lineTo(stopstraightlength, bs - bs / 4)
        break
      case 'tstop':
        context.moveTo(bs / 2, bs - stopstraightlength)
        context.lineTo(bs / 2, bs)
        context.moveTo(bs / 4, bs - stopstraightlength)
        context.lineTo(bs - bs / 4, bs - stopstraightlength)
        break
      case 'bstop':
        context.moveTo(bs / 2, 0)
        context.lineTo(bs / 2, stopstraightlength)
        context.moveTo(bs / 4, stopstraightlength)
        context.lineTo(bs - bs / 4, stopstraightlength)
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

module.exports = LayoutSegmentTrack
