const BasePanel = require('./base')
const cpp = require('./cppConst')
const Bitset = require('bitset')

class KeyPadPanel extends BasePanel {
  address = cpp.I2C_ADDRESS_KEYPAD
  switchStates = [0, 0, 0, 0, 0, 0]

  constructor(segment) { super(segment) }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return

    if (super.Receive(dataBuffer)) return

    try {
      switch (dataBuffer[1]) {
        case cpp.SRVCOM_KEYPAD_REPORT_STATEALL:
          const stateall = cpp.SrvCom_Keypad_Report_StateAll.decode(dataBuffer)
          const bs = new Bitset(stateall.switchStates)
          for (let i = 0; i < 6; i++) {
            const state = bs.get(i)
            if (this.switchStates[i] != bs.state)
              setImmediate(() => this.emit('switchchange', i, state))
            this.switchStates[i] = state
          }
          break
        case cpp.SRVCOM_KEYPAD_REPORT_SWITCHCHANGE:
          const swchange = cpp.SrvCom_Keypad_Report_SwitchChange.decode(dataBuffer)
          if (this.switchStates[swchange.switchIndex] != swchange.switchState)
            setImmediate(() => this.emit('switchchange', swchange.switchIndex, swchange.switchState))
          this.switchStates[swchange.switchIndex] = swchange.switchState
          break
        case cpp.SRVCOM_KEYPAD_REPORT_BUTTONPRESS:
          const btnpress = cpp.SrvCom_Keypad_Report_ButtonPress.decode(dataBuffer)
          setImmediate(() => this.emit('buttonpress', btnpress.buttonIndex, btnpress.isLongPress ? true : false))
          if (btnpress.isLongPress)
            setImmediate(() => this.emit('buttonlongpress', btnpress.buttonIndex))
          else
            setImmediate(() => this.emit('buttonshortpress', btnpress.buttonIndex))
          break
        default:
          throw new Error()
      }
    }
    catch (error) {
      logger.error(`[Segments] KeyPadPanel packet (${dataBuffer[1]}) error`)
    }
  }
}

module.exports = KeyPadPanel
