const { LayoutSegmentBlockElement } = require('./layoutSegmentElement')

class LayoutSegmentTrack extends LayoutSegmentBlockElement {
  type = 'line'
  draw(context) {
    const width = context.canvas.width
    const height = context.canvas.height

    console.log([width, height])

    switch (this.type) {
      case 'hline':
        break
      case 'vline':
        break
      case 'circle':
        break
    }

    context.fillStyle = '#E0E0E0'
    context.fillRect(0, 0, width, height)

    context.fillStyle = '#8090A0'
    context.fillRect(0, (height - 6) / 2, width, 6)
  }
}

module.exports = LayoutSegmentTrack
