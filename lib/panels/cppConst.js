const struct = require('../cppStruct')

module.exports =
{
  SRVCOM_SYS_REPORT_PANELVERSION: 0x80 + 0x01,
  SRVCOM_SYS_REPORT_PANELUPTIME: 0x80 + 0x02,
  SrvCom_Sys_Report_PanelVersion: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "major", struct.uint8_t(),
      "minor", struct.uint8_t(),
      "patch", struct.uint8_t(),
    ]),
  SrvCom_Sys_Report_PanelUptime: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "uptime", struct.uint32_t(),
    ]),



  I2C_ADDRESS_TURNOUT1: 10,
  I2C_ADDRESS_TURNOUT2: 11,
  I2C_ADDRESS_TURNOUT3: 12,
  I2C_ADDRESS_TURNOUT4: 13,
  SRVCOM_TURNOUT_REPORT_STATEALL: 0x01,
  SRVCOM_TURNOUT_REPORT_STATECHANGE: 0x02,
  SRVCOM_TURNOUT_CONTROL_STATE: 0x01,
  SrvCom_Turnout_Report_StateAll: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "turnoutStates", struct.uint8_t(),
    ]),
  SrvCom_Turnout_Report_StateChange: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "turnoutIndex", struct.uint8_t(),
      "turnoutState", struct.uint8_t(),
    ]),
  SrvCom_Turnout_Control_State: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "turnoutIndex", struct.uint8_t(),
      "turnoutState", struct.uint8_t(),
    ]),



  I2C_ADDRESS_KEYPAD: 50,
  SRVCOM_KEYPAD_REPORT_STATEALL: 0x01,
  SRVCOM_KEYPAD_REPORT_SWITCHCHANGE: 0x02,
  SRVCOM_KEYPAD_REPORT_BUTTONPRESS: 0x03,
  SrvCom_Keypad_Report_StateAll: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "switchStates", struct.uint8_t(),
    ]),
  SrvCom_Keypad_Report_SwitchChange: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "switchIndex", struct.uint8_t(),
      "switchState", struct.uint8_t(),
    ]),
  SrvCom_Keypad_Report_ButtonPress: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "buttonIndex", struct.uint8_t(),
      "isLongPress", struct.uint8_t(),
    ]),



  I2C_ADDRESS_AMBIENTLIGHT1: 62,
  I2C_ADDRESS_AMBIENTLIGHT2: 63,
  I2C_ADDRESS_AMBIENTLIGHT3: 64,
  I2C_ADDRESS_AMBIENTLIGHT4: 65,
  SRVCOM_AMBIENTLIGHT_REPORT_STATEALL: 0x01,
  SRVCOM_AMBIENTLIGHT_REPORT_NIGHTSTATECHANGE: 0x02,
  SRVCOM_AMBIENTLIGHT_REPORT_LIGHTSTATECHANGE: 0x03,
  SRVCOM_AMBIENTLIGHT_REPORT_EFFECTSTATECHANGE: 0x04,
  SRVCOM_AMBIENTLIGHT_CONTROL_NIGHTSTATE: 0x01,
  SRVCOM_AMBIENTLIGHT_CONTROL_LIGHTSTATE: 0x02,
  SRVCOM_AMBIENTLIGHT_CONTROL_EFFECTSTATE: 0x03,
  SrvCom_AmbientLight_Report_StateAll: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "nightState", struct.uint8_t(),
      "lightStates", struct.uint8_t(),
      "effectStates", struct.type(struct.uint8_t(), 2),
    ]),
  SrvCom_AmbientLight_Report_NightStateChange: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "state", struct.uint8_t(),
    ]),
  SrvCom_AmbientLight_Report_LightStateChange: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "lightIndex", struct.uint8_t(),
      "state", struct.uint8_t(),
    ]),
  SrvCom_AmbientLight_Report_EffectStateChange: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "effectIndex", struct.uint8_t(),
      "effect", struct.uint8_t(),
    ]),
  SrvCom_AmbientLight_Control_NightState: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "state", struct.uint8_t(),
    ]),
  SrvCom_AmbientLight_Control_LightState: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "lightIndex", struct.uint8_t(),
      "state", struct.uint8_t(),
    ]),
  SrvCom_AmbientLight_Control_EffectState: new struct(null,
    [
      "address", struct.uint8_t(),
      "command", struct.uint8_t(),
      "effectIndex", struct.uint8_t(),
      "effect", struct.uint8_t(),
    ]),

}