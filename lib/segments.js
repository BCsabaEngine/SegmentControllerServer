const EventEmitter = require('events')
const cpp = require('./panels/cppConst')
const TurnoutPanel = require('./panels/turnout')
const SignalPanel = require('./panels/signal')
const KeyPadPanel = require('./panels/keypad')
const SoundPanel = require('./panels/sound')
const AmbientLightPanel = require('./panels/ambientLight')

class Segment extends EventEmitter {
  rf24id = 0
  online = false

  get turnout() { return this.turnout1 }
  turnout1 = new TurnoutPanel(this, cpp.I2C_ADDRESS_TURNOUT1)
  turnout2 = new TurnoutPanel(this, cpp.I2C_ADDRESS_TURNOUT2)
  turnout3 = new TurnoutPanel(this, cpp.I2C_ADDRESS_TURNOUT3)
  turnout4 = new TurnoutPanel(this, cpp.I2C_ADDRESS_TURNOUT4)

  get signal() { return this.signal1 }
  signal1 = new SignalPanel(this, cpp.I2C_ADDRESS_SIGNAL1)
  signal2 = new SignalPanel(this, cpp.I2C_ADDRESS_SIGNAL2)
  signal3 = new SignalPanel(this, cpp.I2C_ADDRESS_SIGNAL3)
  signal4 = new SignalPanel(this, cpp.I2C_ADDRESS_SIGNAL4)
  getSignal(panel) {
    switch (panel) {
      case 1: return this.signal1
      case 2: return this.signal2
      case 3: return this.signal3
      case 4: return this.signal4
      default: return null
    }
  }

  get keypad() { return this.keypad1 }
  keypad1 = new KeyPadPanel(this)

  get sound() { return this.sound1 }
  sound1 = new SoundPanel(this)

  get ambientlight() { return this.ambientlight1 }
  ambientlight1 = new AmbientLightPanel(this, cpp.I2C_ADDRESS_AMBIENTLIGHT1)
  ambientlight2 = new AmbientLightPanel(this, cpp.I2C_ADDRESS_AMBIENTLIGHT2)
  ambientlight3 = new AmbientLightPanel(this, cpp.I2C_ADDRESS_AMBIENTLIGHT3)
  ambientlight4 = new AmbientLightPanel(this, cpp.I2C_ADDRESS_AMBIENTLIGHT4)

  InitAllEvents() {
    this.turnout1.on('change', (...arguments_) => this.emit('event', this.rf24id, 'turnout1', 'change', ...arguments_))
    this.turnout2.on('change', (...arguments_) => this.emit('event', this.rf24id, 'turnout2', 'change', ...arguments_))
    this.turnout3.on('change', (...arguments_) => this.emit('event', this.rf24id, 'turnout3', 'change', ...arguments_))
    this.turnout4.on('change', (...arguments_) => this.emit('event', this.rf24id, 'turnout4', 'change', ...arguments_))

    this.signal1.on('change', (...arguments_) => this.emit('event', this.rf24id, 'signal1', 'change', ...arguments_))
    this.signal2.on('change', (...arguments_) => this.emit('event', this.rf24id, 'signal2', 'change', ...arguments_))
    this.signal3.on('change', (...arguments_) => this.emit('event', this.rf24id, 'signal3', 'change', ...arguments_))
    this.signal4.on('change', (...arguments_) => this.emit('event', this.rf24id, 'signal4', 'change', ...arguments_))

    this.keypad.on('switchchange', (...arguments_) => this.emit('event', this.rf24id, 'keypad', 'switchchange', ...arguments_))
    this.keypad.on('buttonpress', (...arguments_) => this.emit('event', this.rf24id, 'keypad', 'buttonpress', ...arguments_))
    this.keypad.on('buttonshortpress', (...arguments_) => this.emit('event', this.rf24id, 'keypad', 'buttonshortpress', ...arguments_))
    this.keypad.on('buttonlongpress', (...arguments_) => this.emit('event', this.rf24id, 'keypad', 'buttonlongpress', ...arguments_))

    this.sound.on('change', (...arguments_) => this.emit('event', this.rf24id, 'sound', 'change', ...arguments_))

    this.ambientlight1.on('nightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight1', 'nightchange', ...arguments_))
    this.ambientlight1.on('lightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight1', 'lightchange', ...arguments_))
    this.ambientlight1.on('effectchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight1', 'effectchange', ...arguments_))
    this.ambientlight2.on('nightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight2', 'nightchange', ...arguments_))
    this.ambientlight2.on('lightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight2', 'lightchange', ...arguments_))
    this.ambientlight2.on('effectchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight2', 'effectchange', ...arguments_))
    this.ambientlight3.on('nightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight3', 'nightchange', ...arguments_))
    this.ambientlight3.on('lightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight3', 'lightchange', ...arguments_))
    this.ambientlight3.on('effectchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight3', 'effectchange', ...arguments_))
    this.ambientlight4.on('nightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight4', 'nightchange', ...arguments_))
    this.ambientlight4.on('lightchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight4', 'lightchange', ...arguments_))
    this.ambientlight4.on('effectchange', (...arguments_) => this.emit('event', this.rf24id, 'ambientlight4', 'effectchange', ...arguments_))
  }

  constructor(rf24id = 0) {
    super()
    this.InitAllEvents()
    this.rf24id = rf24id
  }
  IsValid() { return this.rf24id ? true : false }

  Send(dataBuffer) {
    if (this.IsValid && this.online)
      rf24.send(this.rf24id, dataBuffer)
  }

  Receive(dataBuffer) {
    if (!this.online) {
      this.online = true
      setImmediate(() => this.emit('online'))
    }
    if (dataBuffer.length < 2) return
    switch (dataBuffer[0]) {
      case cpp.I2C_ADDRESS_TURNOUT1:
        this.turnout1.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_TURNOUT2:
        this.turnout2.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_TURNOUT3:
        this.turnout3.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_TURNOUT4:
        this.turnout4.Receive(dataBuffer)
        break

      case cpp.I2C_ADDRESS_SIGNAL1:
        this.signal1.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_SIGNAL2:
        this.signal2.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_SIGNAL3:
        this.signal3.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_SIGNAL4:
        this.signal4.Receive(dataBuffer)
        break

      case cpp.I2C_ADDRESS_KEYPAD:
        this.keypad.Receive(dataBuffer)
        break

      case cpp.I2C_ADDRESS_SOUND:
        this.sound.Receive(dataBuffer)
        break

      case cpp.I2C_ADDRESS_AMBIENTLIGHT1:
        this.ambientlight1.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_AMBIENTLIGHT2:
        this.ambientlight2.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_AMBIENTLIGHT3:
        this.ambientlight3.Receive(dataBuffer)
        break
      case cpp.I2C_ADDRESS_AMBIENTLIGHT4:
        this.ambientlight4.Receive(dataBuffer)
        break

      default:
        logger.error(`[Segment] Invalid panel: ${dataBuffer[0]}`)
        break
    }
  }
}

class SegmentsHandler extends EventEmitter {
  segments = new Map()

  constructor(rf24handler) {
    super()
    rf24handler.on('receive', function (fromNode, dataBuffer) {
      this.GetSegmentById(fromNode).Receive(dataBuffer)
    }.bind(this))
  }

  GetSegmentIds() { return [...this.segments.keys()] }

  HasSegmentById(id) { return this.segments.has(id) }

  GetSegmentById(id) {
    if (!this.HasSegmentById(id)) {
      const newsegment = new Segment(id)
      newsegment.on('event', (...arguments_) => this.emit('event', ...arguments_))
      this.segments.set(id, newsegment)
    }
    return this.segments.get(id)
  }

  InitializeEventsToDashboard() {
    this.on('event', (...arguments_) => {
      //console.log(arguments_)

      let segmentid, panel, event, eventdata
      [segmentid, panel, event, ...eventdata] = arguments_
      ws.broadcast({ segmentid, panel, event, eventdata }, 'dashboard')
    })
  }
}

module.exports = (rf24handler) => new SegmentsHandler(rf24handler)
