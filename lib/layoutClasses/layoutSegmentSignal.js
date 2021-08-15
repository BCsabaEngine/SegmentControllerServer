const { createCanvas } = require('canvas')

const { LayoutSegmentBlockElement } = require('./layoutSegmentElement')

const POLE_COLOR = '#606060'
const valudBulbs = new Set(['R', 'G', 'Y', 'B', 'W'])
const bulbColors = { R: 'red', G: 'green', Y: 'yellow', B: 'blue', W: 'white' }

class LayoutSegmentSignal extends LayoutSegmentBlockElement {
  type = ''
  bulbs = ''

  static getTypes() {
    return {
      nsignal: 'North',
      nesignal: 'North-east',
      esignal: 'East',
      sesignal: 'South-east',
      ssignal: 'South',
      swsignal: 'South-west',
      wsignal: 'West',
      nwsignal: 'North-west',
    }
  }

  static isValidBulbs(bulbs) {
    if ((typeof bulbs === 'string' || bulbs instanceof String) && bulbs.length > 0 && bulbs.length <= 4) {
      bulbs = bulbs.toUpperCase()

      let isvalid = true
      for (const bulb of bulbs)
        if (!valudBulbs.has(bulb)) {
          isvalid = false
          break
        }
      return isvalid
    }
    return false
  }

  constructor(x, y, type, bulbs) {
    super(x, y)
    this.setType(type)
    this.setBulbs(bulbs)
  }

  setType(type) { if (type in LayoutSegmentSignal.getTypes()) this.type = type }

  setBulbs(bulbs) { if (LayoutSegmentSignal.isValidBulbs(bulbs)) this.bulbs = bulbs.toUpperCase() }

  draw(context2d, layout) {
    const bs = layout.blockSize

    const trackwidth = bs / 4
    const sidewidth = (bs - trackwidth) / 2

    const polelength = bs / 4
    const polewidth = bs / 16

    const bulbradius = bs / 2 / 4 / 2
    const bulbcount = this.bulbs.length
    const bulbsheight = bulbradius * 2 * bulbcount + 2 + (bulbcount - 1) * 2
    const bulbswidth = bulbradius * 2 + 2

    context2d.save()
    switch (this.type) {
      case 'nsignal':
        break
      case 'nesignal':
        context2d.translate(bs / 2, 0 - 6)
        context2d.rotate(45 * Math.PI / 180)
        break
      case 'esignal':
        context2d.translate(bs, 0)
        context2d.rotate(90 * Math.PI / 180)
        break
      case 'sesignal':
        context2d.translate(bs + 6, bs / 2)
        context2d.rotate(135 * Math.PI / 180)
        break
      case 'ssignal':
        context2d.translate(bs, bs)
        context2d.rotate(-180 * Math.PI / 180)
        break
      case 'swsignal':
        context2d.translate(bs / 2 - 0, bs + 6)
        context2d.rotate(-135 * Math.PI / 180)
        break
      case 'wsignal':
        context2d.translate(0, bs)
        context2d.rotate(-90 * Math.PI / 180)
        break
      case 'nwsignal':
        context2d.translate(0 - 6, bs / 2)
        context2d.rotate(-45 * Math.PI / 180)
        break
    }
    context2d.beginPath()
    context2d.fillStyle = POLE_COLOR
    context2d.strokeStyle = POLE_COLOR
    context2d.lineWidth = polewidth
    context2d.fillRect(bs - sidewidth + sidewidth / 2 - bulbswidth / 2, (bs - bulbsheight - polelength) / 2, bulbswidth, bulbsheight)
    context2d.moveTo(bs - sidewidth + sidewidth / 2, (bs - bulbsheight - polelength) / 2 + bulbsheight)
    context2d.lineTo(bs - sidewidth + sidewidth / 2, (bs - bulbsheight - polelength) / 2 + bulbsheight + polelength)
    context2d.stroke()

    for (let index = 0; index < bulbcount; index++) {
      context2d.beginPath()
      const color = bulbColors[this.bulbs[index]]
      context2d.fillStyle = color
      context2d.arc(bs - sidewidth + sidewidth / 2, 3 + (bs - bulbsheight - polelength) / 2 + index * (bulbradius * 2 + 2), bulbradius, 0, 2 * Math.PI)
      context2d.fill()
    }
    context2d.restore()
  }
  getImage(layout) {
    const canvas = createCanvas(layout.blockSize, layout.blockSize)
    const context2d = canvas.getContext('2d')
    this.draw(context2d, layout)

    return canvas.toBuffer('image/png', runtimeConfig.pngExport)
  }
}

module.exports = LayoutSegmentSignal
