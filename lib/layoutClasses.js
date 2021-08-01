class Layout {
  blockWidth = 32
  blockHeight = 32
  name = 'Default'
  segments = []
}

class LayoutSegment {
  id = 0
  name = ''
  x = 0
  y = 0
  width = 0
  height = 0

  tracks = []
  terrains = []
  buildings = []

  autoCalcSize() {
    this.width = 0
    this.height = 0
    for (const track of this.tracks) {
      if (this.width < track.x) this.width = track.x
      if (this.height < track.y) this.height = track.y
    }
    for (const terrain of this.terrains) {
      if (this.width < terrain.x + terrain.width) this.width = terrain.x + terrain.width
      if (this.height < terrain.y + terrain.height) this.height = terrain.y + terrain.height
    }
    for (const building of this.buildings) {
      if (this.width < building.x + building.width) this.width = building.x + building.width
      if (this.height < building.y + building.height) this.height = building.y + building.height
    }
  }

  findTrack(x, y) {
    for (const track of this.tracks)
      if (track.x === x && track.y === y)
        return track
    return null
  }
}

class LayoutSegmentBlockElement {
  x = 0
  y = 0
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class LayoutSegmentElement {
  x = 0
  y = 0
  width = 0
  height = 0
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}

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

class LayoutSegmentSignal extends LayoutSegmentBlockElement { }

class LayoutSegmentTerrain extends LayoutSegmentElement {
  color = '#888'
  constructor(x, y, width, height, color = '#888') {
    super(x, y, width, height)
    this.color = color
  }
}

class LayoutSegmentBuilding extends LayoutSegmentElement {
  text = ''
  constructor(x, y, width, height, text = '') {
    super(x, y, width, height)
    this.text = text
  }
}

module.exports = {
  Layout,
  LayoutSegment,
  LayoutSegmentTrack,
  LayoutSegmentSignal,
  LayoutSegmentTerrain, LayoutSegmentBuilding
}
