class Layout {
  name = 'Default'
  blockSize = 32
  worldColor = '#333'
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
}

module.exports = Layout
