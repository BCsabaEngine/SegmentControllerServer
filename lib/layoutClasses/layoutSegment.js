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

module.exports = LayoutSegment
