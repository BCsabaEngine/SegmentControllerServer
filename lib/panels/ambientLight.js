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

          if (this.nightState != stateall.nightState)
            setImmediate(() => this.emit('nightchange', stateall.nightState))
          this.nightState = stateall.nightState

          const bs = new Bitset(stateall.lightStates)
          for (let i = 0; i < 6; i++) {
            const state = bs.get(i)
            if (this.lightStates[i] != state)
              setImmediate(() => this.emit('lightchange', i, state))
            this.lightStates[i] = state
          }

          if (this.effects[0] != stateall.effectStates[0])
            setImmediate(() => this.emit('effectchange', 0, stateall.effectStates[0]))
          this.effects[0] = stateall.effectStates[0]
          if (this.effects[1] != stateall.effectStates[1])
            setImmediate(() => this.emit('effectchange', 1, stateall.effectStates[1]))
          this.effects[1] = stateall.effectStates[1]
          break
        case cpp.SRVCOM_AMBIENTLIGHT_REPORT_NIGHTSTATECHANGE:
          const nightchange = cpp.SrvCom_AmbientLight_Report_NightStateChange.decode(dataBuffer)
          if (this.nightState != nightchange.state)
            setImmediate(() => this.emit('nightchange', nightchange.state))
          this.nightState = nightchange.state
          break
        case cpp.SRVCOM_AMBIENTLIGHT_REPORT_LIGHTSTATECHANGE:
          const lightchange = cpp.SrvCom_AmbientLight_Report_LightStateChange.decode(dataBuffer)
          if (this.lightStates[lightchange.lightIndex] != lightchange.state)
            setImmediate(() => this.emit('lightchange', lightchange.lightIndex, lightchange.state))
          this.lightStates[lightchange.lightIndex] = lightchange.state
          break
        case cpp.SRVCOM_AMBIENTLIGHT_REPORT_EFFECTSTATECHANGE:
          const effectchange = cpp.SrvCom_AmbientLight_Report_EffectStateChange.decode(dataBuffer)
          if (this.effects[effectchange.effectIndex] != effectchange.effect)
            setImmediate(() => this.emit('effectchange', effectchange.effectIndex, effectchange.effect))
          this.effects[effectchange.effectIndex] = effectchange.effect
          break
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
