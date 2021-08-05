class Layout {
  name = 'Default'
  blockSize = 32
  worldColor = '#333'
  terrainMargin = 4
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
      width: 0,
      height: 0
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

  normalize() {
    let minx = Number.POSITIVE_INFINITY
    let miny = Number.POSITIVE_INFINITY

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
}

module.exports = Layout
