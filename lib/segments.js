const EventEmitter = require('events')
const cpp = require('./panels/cppConst')
const MasterBoard = require('./panels/master')
const TurnoutPanel = require('./panels/turnout')
const SignalPanel = require('./panels/signal')
const KeyPadPanel = require('./panels/keypad')
const SoundPanel = require('./panels/sound')
const AmbientLightPanel = require('./panels/ambientLight')

class Segment extends EventEmitter {
  segmentid = 0
  mode = ''
  ipaddress = ''

  master = new MasterBoard(this)

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

  InitAllPanelEvents() {
    this.turnout1.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'turnout1', 'change', ...arguments_))
    this.turnout2.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'turnout2', 'change', ...arguments_))
    this.turnout3.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'turnout3', 'change', ...arguments_))
    this.turnout4.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'turnout4', 'change', ...arguments_))

    this.signal1.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'signal1', 'change', ...arguments_))
    this.signal2.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'signal2', 'change', ...arguments_))
    this.signal3.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'signal3', 'change', ...arguments_))
    this.signal4.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'signal4', 'change', ...arguments_))

    this.keypad.on('switchchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'keypad', 'switchchange', ...arguments_))
    this.keypad.on('buttonpress', (...arguments_) => this.emit('panelevent', this.segmentid, 'keypad', 'buttonpress', ...arguments_))
    this.keypad.on('buttonshortpress', (...arguments_) => this.emit('panelevent', this.segmentid, 'keypad', 'buttonshortpress', ...arguments_))
    this.keypad.on('buttonlongpress', (...arguments_) => this.emit('panelevent', this.segmentid, 'keypad', 'buttonlongpress', ...arguments_))

    this.sound.on('change', (...arguments_) => this.emit('panelevent', this.segmentid, 'sound', 'change', ...arguments_))

    this.ambientlight1.on('nightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight1', 'nightchange', ...arguments_))
    this.ambientlight1.on('lightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight1', 'lightchange', ...arguments_))
    this.ambientlight1.on('effectchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight1', 'effectchange', ...arguments_))
    this.ambientlight2.on('nightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight2', 'nightchange', ...arguments_))
    this.ambientlight2.on('lightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight2', 'lightchange', ...arguments_))
    this.ambientlight2.on('effectchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight2', 'effectchange', ...arguments_))
    this.ambientlight3.on('nightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight3', 'nightchange', ...arguments_))
    this.ambientlight3.on('lightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight3', 'lightchange', ...arguments_))
    this.ambientlight3.on('effectchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight3', 'effectchange', ...arguments_))
    this.ambientlight4.on('nightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight4', 'nightchange', ...arguments_))
    this.ambientlight4.on('lightchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight4', 'lightchange', ...arguments_))
    this.ambientlight4.on('effectchange', (...arguments_) => this.emit('panelevent', this.segmentid, 'ambientlight4', 'effectchange', ...arguments_))
  }

  constructor(segmentid) {
    super()
    this.segmentid = segmentid
    this.InitAllPanelEvents()
  }
  GetValidPanels() {
    const panels = []

    if (this.master.initialized) panels.push('MasterBoard')

    if (this.turnout1.initialized) panels.push('Turnout 1')
    if (this.turnout2.initialized) panels.push('Turnout 2')
    if (this.turnout3.initialized) panels.push('Turnout 3')
    if (this.turnout4.initialized) panels.push('Turnout 4')

    if (this.signal1.initialized) panels.push('Signal 1')
    if (this.signal2.initialized) panels.push('Signal 2')
    if (this.signal3.initialized) panels.push('Signal 3')
    if (this.signal4.initialized) panels.push('Signal 4')

    if (this.keypad.initialized) panels.push('Keypad')

    if (this.sound.initialized) panels.push('Sound')

    if (this.ambientlight1.initialized) panels.push('AmbientLight 1')
    if (this.ambientlight2.initialized) panels.push('AmbientLight 2')
    if (this.ambientlight3.initialized) panels.push('AmbientLight 3')
    if (this.ambientlight4.initialized) panels.push('AmbientLight 4')

    return panels
  }

  GetMode() {
    switch (this.mode) {
      case 'wifi':
        return { mode: 'wifi', ip: this.ipaddress, id: this.segmentid }
      case 'rf24':
        return { mode: 'rf24', id: this.segmentid }
      default:
        return null
    }
  }
  GetModeAsString() {
    switch (this.mode) {
      case 'wifi':
        return `#${this.segmentid} WiFi (${this.ipaddress})`
      case 'rf24':
        return `#${this.segmentid} RF24`
      default:
        return `#${this.segmentid} Unknown`
    }
  }

  Reset(withPanels) { this.master.Reset(withPanels) }

  Send(dataBuffer) {
    switch (this.mode) {
      case 'rf':
        rf24.send(this.segmentid, dataBuffer)
        break
      case 'wifi':
        wifi.send(this.segmentid, this.ipaddress, dataBuffer)
        break
      default:
        break
    }
  }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return
    switch (dataBuffer[0]) {

      case 0:
        this.master.Receive(dataBuffer)
        break

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
  ReceiveRf24(dataBuffer) {
    if (!this.mode) {
      this.mode = 'rf24'
      setImmediate(() => this.emit('modechanged', this.segmentid, 'rf24'))
    }
    this.Receive(dataBuffer)
  }
  ReceiveWiFi(ip, dataBuffer) {
    if (!this.mode) {
      this.mode = 'wifi'
      this.ipaddress = ip
      setImmediate(() => this.emit('modechanged', this.segmentid, 'wifi'))
    }
    this.Receive(dataBuffer)
  }
}

class SegmentsHandler extends EventEmitter {
  segments = new Map()

  constructor(rf24handler, wifihandler) {
    super()
    rf24handler.on('receive', function (fromNode, dataBuffer) {
      this.AccessSegmentById(fromNode).ReceiveRf24(dataBuffer)
    }.bind(this))
    wifihandler.on('receive', function (fromNode, ip, dataBuffer) {
      this.AccessSegmentById(fromNode).ReceiveWiFi(ip, dataBuffer)
    }.bind(this))
  }

  GetSegmentIds() { return [...this.segments.keys()] }

  SegmentExists(id) { return this.segments.has(id) }

  AccessSegmentById(id) { return this.GetSegmentByIdInternal(id, true) }
  GetSegmentById(id) { return this.GetSegmentByIdInternal(id, false, true) }
  FindSegmentById(id) { return this.GetSegmentByIdInternal(id, false, false) }
  GetSegmentByIdInternal(id, allowcreate = false, throwerror = false) {
    if (!this.SegmentExists(id)) {
      if (allowcreate) {
        const newsegment = new Segment(id)
        newsegment.on('panelevent', (...arguments_) => this.emit('panelevent', ...arguments_))
        newsegment.on('modechanged', (...arguments_) => this.emit('segmentmodechanged', ...arguments_))
        this.segments.set(id, newsegment)
      }
      else if (throwerror)
        throw new Error(`Segment #${id} not found`)
      else
        return null
    }
    return this.segments.get(id)
  }

  InitializeEventsToDashboard() {
    this.on('panelevent', (...arguments_) => {
      //console.log(arguments_)

      let segmentid, panel, event, eventdata
      [segmentid, panel, event, ...eventdata] = arguments_
      ws.broadcast({ segmentid, panel, event, eventdata }, 'dashboard-element')
    })
    this.on('segmentmodechanged', (...arguments_) => {
      console.log(arguments_)

      let segmentid, mode
      [segmentid, mode] = arguments_
      ws.broadcast({ title: `Controller #${segmentid} connected`, message: `Mode: ${mode}` }, 'network-change')
    })
  }
}

module.exports = (rf24handler, wifihandler) => new SegmentsHandler(rf24handler, wifihandler)
