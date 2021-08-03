const { LayoutSegmentElement } = require('./layoutSegmentElement')

class LayoutSegmentTerrain extends LayoutSegmentElement {
  color = '#888'

  constructor(x, y, width, height, color = '#888') {
    super(x, y, width, height)
    this.color = color
  }
}

module.exports = LayoutSegmentTerrain
