const LayoutSegment = require('./layoutSegment')

class Layout {
  lastModify = Date.now()
  name = 'Default'
  blockSize = 32
  worldColor = '#303030'
  terrainMargin = 4
  predefinedSurfaceColors = {
    '#40c020': 'Grass',
    '#d0d010': 'Corn',
    '#2090c0': 'River',
    '#c2b280': 'Sand',
    '#70483c': 'Mud',
    '#404040': 'Road',
  }
  segments = []

  draw(context) {
    const size = this.getImageSize()
    context.fillStyle = this.worldColor
    context.fillRect(0, 0, size.width, size.height)
    for (const segment of this.segments)
      segment.drawTerrains(context, this)
    for (const segment of this.segments)
      segment.drawTracks(context, this)
  }

  getImageSize() {
    const size = this.getSize()
    return {
      width: size.width * this.blockSize,
      height: size.height * this.blockSize
    }
  }
  getSize() {
    const result = {
      width: 1,
      height: 1
    }
    for (const segment of this.segments) {
      const segsize = segment.getSize()
      if (result.width < segment.x + segsize.width) result.width = segment.x + segsize.width
      if (result.height < segment.y + segsize.height) result.height = segment.y + segsize.height
    }
    return result
  }

  getSegmentById(id) {
    for (const segment of this.segments)
      if (Number(segment.id) === Number(id))
        return segment
    return null
  }

  getAllSegmentIds() {
    const result = []
    for (const segment of this.segments)
      if (!result.includes(Number(segment.id)))
        result.push(Number(segment.id))
    return result
  }

  getAllSegments() { return this.segments }

  getNextAvailableId() {
    const ids = this.getAllSegmentIds()

    let result = 1
    while (ids.includes(result)) result++
    return result
  }

  normalize() {
    let minx = Number.POSITIVE_INFINITY
    let miny = Number.POSITIVE_INFINITY

    this.segments.sort((a, b) => a.id - b.id)

    for (const segment of this.segments) {
      if (minx > segment.x) minx = segment.x
      if (miny > segment.y) miny = segment.y
    }
    for (const segment of this.segments) {
      if (minx && minx !== Number.POSITIVE_INFINITY)
        segment.x -= minx
      if (miny && miny !== Number.POSITIVE_INFINITY)
        segment.y -= miny
    }
  }

  setBlockSize(newsize) {
    if (Number.isNaN(newsize) || ![16, 24, 32, 48].includes(newsize))
      throw new Error(`Invalid block size: ${newsize}`)
    this.blockSize = newsize
    if (this.terrainMargin > this.blockSize / 4)
      this.terrainMargin = this.blockSize / 4
  }
  setWorldColor(newcolor) {
    const normalizedcolor = global.normalizeRGBColor(newcolor)
    if (!normalizedcolor)
      throw new Error(`Invalid color: ${newcolor}`)
    this.worldColor = normalizedcolor
  }
  setTerrainMargin(newmargin) {
    if (Number.isNaN(newmargin) || newmargin < 0 || newmargin > this.blockSize / 4)
      throw new Error(`Invalid terrain margin: ${newmargin}`)
    this.terrainMargin = newmargin
  }
  setSegmentLocations(locations) {
    if (!locations) throw new Error('Empty location data')

    for (const id in locations) {
      const segment = this.getSegmentById(id)
      if (!segment)
        throw new Error(`Segment ${id} not found`)
      segment.x = locations[id].x
      segment.y = locations[id].y
    }
  }
  addNewSegment(id, name) {
    if (Number.isNaN(id) || id < 0 || id > 127)
      throw new Error(`Invalid segment id: ${id}`)
    if (this.getSegmentById(id))
      throw new Error(`Segment with id #${id} already exists`)
    if (!name.trim())
      throw new Error(`Name cannot be empty: ${name}`)

    const newsegment = LayoutSegment.createDefault()
    newsegment.id = id
    newsegment.name = name.trim()
    newsegment.x = this.getSize().width + 1
    newsegment.y = 1
    this.segments.push(newsegment)
  }
  setSegmentName(id, name) {
    const segment = this.getSegmentById(id)
    if (!segment)
      throw new Error(`Segment ${id} not found`)
    if (!name.trim())
      throw new Error(`Name cannot be empty: ${name}`)

    segment.name = name.trim()
  }
  setSegmentId(id, newid) {
    const segment = this.getSegmentById(id)
    if (!segment)
      throw new Error(`Segment ${id} not found`)
    if (Number.isNaN(newid) || newid < 0 || newid > 127)
      throw new Error(`Invalid new segment id: ${newid}`)
    if (this.getSegmentById(newid))
      throw new Error(`Segment with id #${newid} already exists`)

    segment.id = newid
  }
  deleteSegmentById(id) {
    for (let index = 0; index < this.segments.length; index++) {
      const segment = this.segments[index]
      if (Number(segment.id) === Number(id)) {
        this.segments.splice(index, 1)
        break
      }
    }
  }

}

module.exports = Layout
