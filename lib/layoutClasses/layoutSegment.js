const { Grid } = require('./grid')
const { TerrainGridItem } = require('./layoutGrids')
const LayoutSegmentTrack = require('./layoutSegmentTrack')
const LayoutSegmentTerrain = require('./layoutSegmentTerrain')
const LayoutSegmentBuilding = require('./layoutSegmentBuilding')

class LayoutSegment {
  id = 0
  name = ''
  baseColor = '#909090'
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
  static generateRandom(size, mode) {
    if (size < 6) size = 6
    size = Math.round(size / 2) * 2

    const result = new LayoutSegment(0, 0)
    switch (mode) {
      case 0: //river
        result.terrains.push(
          new LayoutSegmentTerrain(0, 0, 2, size, '#3050A0', 'River'),
          new LayoutSegmentTerrain(1, size - 2, size - 1, 2, '#3050A0'),
        )
        break
      case 1: //conrfield
        result.terrains.push(
          new LayoutSegmentTerrain(0, 0, size / 2, size, '#A8A830', 'Cornfield'),
          new LayoutSegmentTerrain(0, 0, size, 1, '#B8B840'),
          new LayoutSegmentTerrain(size / 2 + 1, 2, 2, 2, '#10BB10', 'Flowers'),
        )
        break
      default: //center
        result.terrains.push(
          new LayoutSegmentTerrain(2, 2, size / 2, size / 2, '#104010', 'Forest'),
        )
        break
    }

    return result
  }
  static createDefault() {
    const result = new LayoutSegment(0, 0)
    result.terrains.push(
      new LayoutSegmentTerrain(0, 0, 4, 4, '#104010', 'New forest'),
    )
    return result
  }

  getSize() {
    const result = {
      width: 1,
      height: 1
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

  setBaseColor(newcolor) {
    const normalizedcolor = global.normalizeRGBColor(newcolor)
    if (!normalizedcolor)
      throw new Error(`Invalid color: ${newcolor}`)
    this.baseColor = normalizedcolor
  }

  setElements(elements) {
    if (!elements) throw new Error('Empty elements data')

    console.log(elements)

    this.tracks = []
    this.terrains = []
    this.buildings = []
    for (const id in elements) {
      const element = elements[id]
      switch (element.class) {
        case 'track':
          this.tracks.push(new LayoutSegmentTrack(element.x, element.y, element.type))
          break
        case 'terrain':
          this.terrains.push(new LayoutSegmentTerrain(element.x, element.y, element.w, element.h, element.color, element.text))
          break
        case 'building':
          this.buildings.push(new LayoutSegmentBuilding(element.x, element.y, element.w, element.h, element.color))
          break
        default:
          throw new Error(`Invalid element type: ${element.type}`)
      }
    }
  }
}

module.exports = LayoutSegment
