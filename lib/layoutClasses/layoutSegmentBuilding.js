const { LayoutSegmentElement } = require('./layoutSegmentElement')

class LayoutSegmentBuilding extends LayoutSegmentElement {
  text = ''
  constructor(x, y, width, height, text = '') {
    super(x, y, width, height)
    this.text = text
  }
}

module.exports = LayoutSegmentBuilding
