const { Grid } = require('./grid')
const { TerrainGridItem } = require('./layoutGrids')

class LayoutSegment {
  id = 0
  name = ''
  baseColor = '#999'
  x = 0
  y = 0

  tracks = []
  terrains = []
  buildings = []

  constructor(x, y, color = '#999') {
    this.x = x
    this.y = y
    this.color = color
  }

  getSize() {
    const result = {
      width: 0,
      height: 0
    }
    for (const track of this.tracks) {
      if (result.width < track.x) result.width = track.x
      if (result.height < track.y) result.height = track.y
    }
    for (const terrain of this.terrains) {
      if (result.width < terrain.x + terrain.width) result.width = terrain.x + terrain.width
      if (result.height < terrain.y + terrain.height) result.height = terrain.y + terrain.height
    }
    for (const building of this.buildings) {
      if (result.width < building.x + building.width) result.width = building.x + building.width
      if (result.height < building.y + building.height) result.height = building.y + building.height
    }
    return result
  }
  getImageSize(layout) {
    const size = this.getSize()
    return {
      width: size.width * layout.blockSize,
      height: size.height * layout.blockSize
    }
  }

  findTrack(x, y) {
    for (const track of this.tracks)
      if (track.x === x && track.y === y)
        return track
    return null
  }

  drawTerrains(context, layout, x, y) {
    x = x === undefined ? this.x : x
    y = y === undefined ? this.y : y

    const size = this.getSize()
    const bs = layout.blockSize

    context.fillStyle = this.baseColor
    context.fillRect(x * bs, y * bs, size.width * bs, size.height * bs)

    const grids = Grid.generateGridsFrom(Grid, TerrainGridItem, this.terrains)
    for (const grid of grids) {
      for (const item of grid.getItems())
        item.draw(context, layout, this, x, y, grid)

      // context.beginPath()
      // context.lineWidth = 1
      // for (const line of grid.getContourLines()) {
      //   context.moveTo((x + line.from.x) * bs, (y + line.from.y) * bs)
      //   context.lineTo((x + line.to.x) * bs, (y + line.to.y) * bs)
      // }
      // context.stroke()
    }
    for (const terrain of this.terrains)
      terrain.drawText(context, layout, x, y)
  }

  drawTracks(context, layout, x, y) {
    x = x === undefined ? this.x : x
    y = y === undefined ? this.y : y
    x
    y
  }
}

module.exports = LayoutSegment
