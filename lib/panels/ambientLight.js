const BasePanel = require('./base')
const cpp = require('./cppConst')
const Bitset = require('bitset')

class AmbientLightPanel extends BasePanel {
  address = 0
  nightState = false
  lightStates = [0, 0, 0, 0, 0, 0]
  effects = [0, 0]

  constructor(address) {
    super()
    this.address = address
  }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return

    if (super.Receive(dataBuffer)) return

    try {
      switch (dataBuffer[1]) {
        case cpp.SRVCOM_AMBIENTLIGHT_REPORT_STATEALL:
          const stateall = cpp.SrvCom_AmbientLight_Report_StateAll.decode(dataBuffer)
          this.nightState = stateall.nightSstate
          const bs = new Bitset(stateall.lightStates)
          for (let i = 0; i < 6; i++)
            this.lightStates[i] = bs.get(i)
          this.effects[0] = stateall.effectStates[0]
          this.effects[1] = stateall.effectStates[1]
          // console.log(stateall);
          break;
        case cpp.SRVCOM_AMBIENTLIGHT_REPORT_NIGHTSTATECHANGE:
          const nightchange = cpp.SrvCom_AmbientLight_Report_NightStateChange.decode(dataBuffer)
          this.nightState = nightchange.state
          // console.log(nightchange);
          break;
        case cpp.SRVCOM_AMBIENTLIGHT_REPORT_LIGHTSTATECHANGE:
          const lightchange = cpp.SrvCom_AmbientLight_Report_LightStateChange.decode(dataBuffer)
          this.lightStates[lightchange.lightIndex] = lightchange.state
          // console.log(lightchange);
          break;
        case cpp.SRVCOM_AMBIENTLIGHT_REPORT_EFFECTSTATECHANGE:
          const effectchange = cpp.SrvCom_AmbientLight_Report_EffectStateChange.decode(dataBuffer)
          this.effects[effectchange.effectIndex] = effectchange.effect
          // console.log(effectchange);
          break;
        default:
          throw new Error()
      }
    }
    catch (error) {
      logger.error(`[Segments] AmbientLightPanel packet (${dataBuffer[1]}) error`)
    }
  }
}

module.exports = AmbientLightPanel
