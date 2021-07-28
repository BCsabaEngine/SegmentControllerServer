const BasePanel = require('./base')
const cpp = require('./cppConst')

class SignalState {
  state = false
  customPattern = false
  bulbA = 0
  bulbB = 0
  bulbC = 0
  bulbD = 0

  copyFromSrvComObject(srvcom) {
    const changed =
      this.state !== (srvcom.state ? true : false) ||
      this.customPattern !== (srvcom.customPattern ? true : false) ||
      this.bulbA !== srvcom.bulbA ||
      this.bulbB !== srvcom.bulbB ||
      this.bulbC !== srvcom.bulbC ||
      this.bulbD !== srvcom.bulbD

    this.state = (srvcom.state ? true : false)
    this.customPattern = (srvcom.customPattern ? true : false)
    this.bulbA = srvcom.bulbA
    this.bulbB = srvcom.bulbB
    this.bulbC = srvcom.bulbC
    this.bulbD = srvcom.bulbD

    return changed
  }
}

class SignalPanel extends BasePanel {
  address = 0
  signalStates = []

  constructor(segment, address) {
    super(segment)
    this.address = address
    for (let i = 0; i < cpp.SIGNAL_SIGNALCOUNT; i++)
      this.signalStates[i] = new SignalState()
  }

  SetSignal(index, state) {
    this.SetSignalInternal(index, {
      state: state ? 1 : 0,
      customPattern: false,
      bulbA: 0,
      bulbB: 0,
      bulbC: 0,
      bulbD: 0,
    })
  }

  ToggleSignal(index) {
    this.SetSignalInternal(index, {
      state: 2,
      customPattern: false,
      bulbA: 0,
      bulbB: 0,
      bulbC: 0,
      bulbD: 0,
    })
  }

  SetSignalPattern(index, state) {
    this.SetSignalInternal(index, {
      state: 0,
      customPattern: true,
      bulbA: state.bulbA,
      bulbB: state.bulbB,
      bulbC: state.bulbC,
      bulbD: state.bulbD,
    })
  }

  SetSignalInternal(index, state) {
    const buffer = Buffer.alloc(cpp.SrvCom_Signal_Control_State.size())
    cpp.SrvCom_Signal_Control_State.encode(buffer, 0,
      {
        address: this.address,
        command: cpp.SRVCOM_SIGNAL_CONTROL_STATE,
        signalIndex: index,
        signalState: state,
      })
    this.Send(buffer)
  }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return

    if (super.Receive(dataBuffer)) return

    try {
      switch (dataBuffer[1]) {
        case cpp.SRVCOM_SIGNAL_REPORT_STATEALL:
          const stateall = cpp.SrvCom_Signal_Report_StateAll.decode(dataBuffer)
          for (let i = 0; i < cpp.SIGNAL_SIGNALCOUNT; i++)
            if (this.signalStates[i].copyFromSrvComObject(stateall.states[i]))
              setImmediate(() => this.emit('change', i, this.signalStates[i]))
          break
        case cpp.SRVCOM_SIGNAL_REPORT_STATECHANGE:
          const statechange = cpp.SrvCom_Signal_Report_StateChange.decode(dataBuffer)
          if (statechange.signalIndex < cpp.SIGNAL_SIGNALCOUNT)
            if (this.signalStates[statechange.signalIndex].copyFromSrvComObject(statechange.signalState))
              setImmediate(() => this.emit('change', statechange.signalIndex, this.signalStates[statechange.signalIndex]))
          break
        default:
          throw new Error()
      }
    }
    catch (error) {
      logger.error(`[Segments] SignalPanel packet (${dataBuffer[1]}) error`)
      throw error
    }
  }
}

module.exports = SignalPanel
