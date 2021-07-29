class Layout {
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

  autoCalcSize() {
    this.x = 0
  }
}

class LayoutSegmentBlockElement {
  x = 0
  y = 0
}

class LayoutSegmentElement {
  x = 0
  y = 0
  width = 0
  height = 0
}

class LayoutSegmentTrack extends LayoutSegmentBlockElement { }

class LayoutSegmentSignal extends LayoutSegmentBlockElement { }

class LayoutSegmentTerrain extends LayoutSegmentElement {
  color = '#888'
}

class LayoutSegmentBuilding extends LayoutSegmentElement {
  text = ''
}

module.exports = {
  Layout,
  LayoutSegment,
  LayoutSegmentTrack, LayoutSegmentSignal,
  LayoutSegmentTerrain, LayoutSegmentBuilding
}
