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
          for (let i = 0; i < 6; i++)
            this.switchStates[i] = bs.get(i)
          // console.log(stateall);
          break;
        case cpp.SRVCOM_KEYPAD_REPORT_SWITCHCHANGE:
          const swchange = cpp.SrvCom_Keypad_Report_SwitchChange.decode(dataBuffer)
          this.switchStates[swchange.switchIndex] = swchange.switchState
          // console.log(swchange);
          break;
        case cpp.SRVCOM_KEYPAD_REPORT_BUTTONPRESS:
          const btnpress = cpp.SrvCom_Keypad_Report_ButtonPress.decode(dataBuffer)
          // console.log(btnpress);
          break;
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
