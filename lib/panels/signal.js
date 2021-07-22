const BasePanel = require('./base')
const cpp = require('./cppConst')
const Bitset = require('bitset')

class SignalState {
  state = false
  customPattern = false
  bulb_a = 0
  bulb_b = 0
  bulb_c = 0
  bulb_d = 0

  copyFromSrvComObject(srvcom) {
    this.state = srvcom.state ? true : false
    this.customPattern = srvcom.customPattern ? true : false
    this.bulb_a = srvcom.bulb_a
    this.bulb_b = srvcom.bulb_b
    this.bulb_c = srvcom.bulb_c
    this.bulb_d = srvcom.bulb_d
  }
}

class SignalPanel extends BasePanel {
  address = 0
  signalStates = []

  constructor(segment, address) {
    super(segment)
    this.address = address
    for (let i = 0; i < cpp.SIGNAL_SIGNALCOUNT; i++)
      this.signalStates[i] = new SignalState();
  }

  SetSignal(index, state) {
    this.SetSignalInternal(index, {
      state: state ? 1 : 0,
      customPattern: false,
      bulb_a: 0,
      bulb_b: 0,
      bulb_c: 0,
      bulb_d: 0,
    });
  }

  ToggleSignal(index) {
    this.SetSignalInternal(index, {
      state: 2,
      customPattern: false,
      bulb_a: 0,
      bulb_b: 0,
      bulb_c: 0,
      bulb_d: 0,
    });
  }

  SetSignalPattern(index, state) {
    this.SetSignalInternal(index, {
      state: 0,
      customPattern: true,
      bulb_a: state.bulb_a,
      bulb_b: state.bulb_b,
      bulb_d: state.bulb_c,
      bulb_c: state.bulb_d,
    });
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
            this.signalStates[i].copyFromSrvComObject(stateall.states[i])
          break;
        case cpp.SRVCOM_SIGNAL_REPORT_STATECHANGE:
          const statechange = cpp.SrvCom_Signal_Report_StateChange.decode(dataBuffer)
          if (statechange.signalIndex < cpp.SIGNAL_SIGNALCOUNT)
            this.signalStates[statechange.signalIndex].copyFromSrvComObject(statechange.signalState)
          break;
        default:
          throw new Error()
      }
      console.log(this.signalStates)
    }
    catch (error) {
      logger.error(`[Segments] SignalPanel packet (${dataBuffer[1]}) error`)
    }
  }
}

module.exports = SignalPanel
