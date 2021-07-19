const BasePanel = require('./base')
const cpp = require('./cppConst')
const Bitset = require('bitset')

class TurnoutPanel extends BasePanel {
  address = 0
  turnoutStates = [0, 0, 0, 0, 0, 0]

  constructor(segment, address) {
    super(segment)
    this.address = address
  }

  SetTurnout(index, state) {
    const buffer = Buffer.alloc(cpp.SrvCom_Turnout_Control_State.size())
    cpp.SrvCom_Turnout_Control_State.encode(buffer, 0,
      {
        address: this.address,
        command: cpp.SRVCOM_TURNOUT_CONTROL_STATE,
        turnoutIndex: index,
        turnoutState: state
      })
    this.Send(buffer)
  }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return

    if (super.Receive(dataBuffer)) return

    try {
      switch (dataBuffer[1]) {
        case cpp.SRVCOM_TURNOUT_REPORT_STATEALL:
          const stateall = cpp.SrvCom_Turnout_Report_StateAll.decode(dataBuffer)
          const bs = new Bitset(stateall.turnoutStates)
          for (let i = 0; i < 6; i++)
            this.turnoutStates[i] = bs.get(i)
          // console.log(stateall);
          break;
        case cpp.SRVCOM_TURNOUT_REPORT_STATECHANGE:
          const statechange = cpp.SrvCom_Turnout_Report_StateChange.decode(dataBuffer)
          this.turnoutStates[statechange.turnoutIndex] = statechange.turnoutState
          // console.log(statechange);
          break;
        default:
          throw new Error()
      }
    }
    catch (error) {
      logger.error(`[Segments] TurnoutPanel packet (${dataBuffer[1]}) error`)
    }
  }
}

module.exports = TurnoutPanel
