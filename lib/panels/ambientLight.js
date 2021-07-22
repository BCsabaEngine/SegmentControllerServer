const BasePanel = require('./base')
const cpp = require('./cppConst')
const Bitset = require('bitset')

class AmbientLightPanel extends BasePanel {
  address = 0
  nightState = false
  lightStates = [0, 0, 0, 0, 0, 0]
  effects = [0, 0]

  constructor(segment, address) {
    super(segment)
    this.address = address
  }

  SetNight(state) {
    const buffer = Buffer.alloc(cpp.SrvCom_AmbientLight_Control_NightState.size())
    cpp.SrvCom_AmbientLight_Control_NightState.encode(buffer, 0,
      {
        address: this.address,
        command: cpp.SRVCOM_AMBIENTLIGHT_CONTROL_NIGHTSTATE,
        state: state
      })
    this.Send(buffer)
  }
  ToggleNight() { this.SetNight(2) }

  SetLight(index, state) {
    const buffer = Buffer.alloc(cpp.SrvCom_AmbientLight_Control_LightState.size())
    cpp.SrvCom_AmbientLight_Control_LightState.encode(buffer, 0,
      {
        address: this.address,
        command: cpp.SRVCOM_AMBIENTLIGHT_CONTROL_LIGHTSTATE,
        lightIndex: index,
        state: state
      })
    this.Send(buffer)
  }
  ToggleLight(index) { this.SetLight(index, 2) }

  SetEffect(index, state) {
    const buffer = Buffer.alloc(cpp.SrvCom_AmbientLight_Control_EffectState.size())
    cpp.SrvCom_AmbientLight_Control_EffectState.encode(buffer, 0,
      {
        address: this.address,
        command: cpp.SRVCOM_AMBIENTLIGHT_CONTROL_EFFECTSTATE,
        effectIndex: index,
        state: state
      })
    this.Send(buffer)
  }
  ToggleEffect(index) { this.SetEffect(index, 2) }

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
