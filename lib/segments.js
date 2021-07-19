class BasePanel {

}

class KeyPadPanel extends BasePanel {

}

class Segment {
  id = 0
  keypad = new KeyPadPanel()

  constructor(id = 0) { this.id = id }

  IsValid() { return this.id }

  ProcessReceive(dataBuffer) {

  }
}

class SegmentsHandler {
  segments = new Map()

  constructor(rf24handler) {
    rf24handler.on('receive', function (fromNode, dataBuffer) {
      if (!this.segments.has(fromNode))
        this.segments.set(fromNode, new Segment(fromNode))
      this.segments.get(fromNode).ProcessReceive(dataBuffer)
    }.bind(this))
  }

  GetSegmentIds() { return Array.from(this.segments.keys()) }

  GetSegmentById(id) {
    if (this.segments.has(id)) return this.segments.get(id)
    return new Segment(0)
  }
}

module.exports = (rf24handler) => new SegmentsHandler(rf24handler)
