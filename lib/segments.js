const cpp = require('./panels/cppConst')
const TurnoutPanel = require('./panels/turnout')
const KeyPadPanel = require('./panels/keypad')
const AmbientLightPanel = require('./panels/ambientLight')

class Segment {
  id = 0
  turnout1 = new TurnoutPanel(cpp.I2C_ADDRESS_TURNOUT1)
  turnout2 = new TurnoutPanel(cpp.I2C_ADDRESS_TURNOUT2)
  turnout3 = new TurnoutPanel(cpp.I2C_ADDRESS_TURNOUT3)
  turnout4 = new TurnoutPanel(cpp.I2C_ADDRESS_TURNOUT4)
  keypad = new KeyPadPanel()
  ambientlight1 = new AmbientLightPanel(cpp.I2C_ADDRESS_AMBIENTLIGHT1)
  ambientlight2 = new AmbientLightPanel(cpp.I2C_ADDRESS_AMBIENTLIGHT2)
  ambientlight3 = new AmbientLightPanel(cpp.I2C_ADDRESS_AMBIENTLIGHT3)
  ambientlight4 = new AmbientLightPanel(cpp.I2C_ADDRESS_AMBIENTLIGHT4)

  constructor(id = 0) { this.id = id }
  IsValid() { return this.id }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return
    switch (dataBuffer[0]) {
      case cpp.I2C_ADDRESS_TURNOUT1:
        this.turnout1.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_TURNOUT2:
        this.turnout2.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_TURNOUT3:
        this.turnout3.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_TURNOUT4:
        this.turnout4.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_KEYPAD:
        this.keypad.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_AMBIENTLIGHT1:
        this.ambientlight1.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_AMBIENTLIGHT2:
        this.ambientlight2.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_AMBIENTLIGHT3:
        this.ambientlight3.Receive(dataBuffer)
        break;
      case cpp.I2C_ADDRESS_AMBIENTLIGHT4:
        this.ambientlight4.Receive(dataBuffer)
        break;
      default:
        logger.error(`[Segment] Invalid panel: ${dataBuffer[0]}`)
        break;
    }
  }
}

class SegmentsHandler {
  segments = new Map()

  constructor(rf24handler) {
    rf24handler.on('receive', function (fromNode, dataBuffer) {
      if (!this.segments.has(fromNode))
        this.segments.set(fromNode, new Segment(fromNode))
      this.segments.get(fromNode).Receive(dataBuffer)
    }.bind(this))
  }

  GetSegmentIds() { return Array.from(this.segments.keys()) }

  GetSegmentById(id) {
    if (this.segments.has(id)) return this.segments.get(id)
    return new Segment(0)
  }
}

module.exports = (rf24handler) => new SegmentsHandler(rf24handler)
