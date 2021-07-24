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

  ToggleTurnout(index) { this.SetTurnout(index, 2) }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return

    if (super.Receive(dataBuffer)) return

    try {
      switch (dataBuffer[1]) {
        case cpp.SRVCOM_TURNOUT_REPORT_STATEALL:
          const stateall = cpp.SrvCom_Turnout_Report_StateAll.decode(dataBuffer)
          const bs = new Bitset(stateall.turnoutStates)
          for (let i = 0; i < 6; i++) {
            const state = bs.get(i) ? true : false
            if (this.turnoutStates[i] != state)
              setImmediate(() => this.emit('change', i, state))
            this.turnoutStates[i] = bs.state
          }
          break
        case cpp.SRVCOM_TURNOUT_REPORT_STATECHANGE:
          const statechange = cpp.SrvCom_Turnout_Report_StateChange.decode(dataBuffer)
          if (this.turnoutStates[statechange.turnoutIndex] != statechange.turnoutState)
            setImmediate(() => this.emit('change', statechange.turnoutIndex, statechange.turnoutState ? true : false))
          this.turnoutStates[statechange.turnoutIndex] = statechange.turnoutState
          break
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
