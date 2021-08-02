const { LayoutSegmentElement } = require('./layoutSegmentElement')
const { TerrainGrid } = require('./grid')

class LayoutSegmentTerrain extends LayoutSegmentElement {
  color = '#888'

  constructor(x, y, width, height, color = '#888') {
    super(x, y, width, height)
    this.color = color
  }

  draw(context, layout, x, y) {
    const bs = layout.blockSize
    const px = (x + this.x) * bs
    const py = (y + this.y) * bs
    const pw = this.width * bs
    const ph = this.height * bs

    const grid = new TerrainGrid()
    grid.insert(this)

    context.beginPath()
    for (const line of grid.getContourLines()) {
      //console.log(line)
      context.moveTo((x + line.from.x) * bs, (y + line.from.y) * bs)
      context.lineTo((x + line.to.x) * bs, (y + line.to.y) * bs)
    }
    context.stroke()

    //context.fillStyle = this.color
    //context.fillRect(px, py, pw, ph)
  }
}

module.exports = LayoutSegmentTerrain
