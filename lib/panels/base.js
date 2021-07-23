const cpp = require('./cppConst')

class BasePanel {
  segment = null
  version = ''
  uptimems = 0
  uptimetime = 0

  constructor(segment) { this.segment = segment }

  GetVersion() { return `v${this.version}` }

  GetUptimeSec() {
    if (!this.uptimetime) return 0

    return Math.round((this.uptimems + (new Date() - this.uptimetime)) / 1000)
  }

  Reset() {
    const buffer = Buffer.alloc(cpp.SrvCom_Sys_Control_Reset.size())
    cpp.SrvCom_Sys_Control_Reset.encode(buffer, 0,
      {
        address: this.address,
        command: cpp.SRVCOM_SYS_CONTROL_RESET,
      })
    this.Send(buffer)
  }

  Send(dataBuffer) { if (this.segment) this.segment.Send(dataBuffer) }

  Receive(dataBuffer) {
    if (dataBuffer.length < 2) return

    try {
      switch (dataBuffer[1]) {
        case cpp.SRVCOM_SYS_REPORT_PANELVERSION:
          const version = cpp.SrvCom_Sys_Report_PanelVersion.decode(dataBuffer)
          this.version = `${version.major}.${version.minor}.${version.patch}.`
          return true
        case cpp.SRVCOM_SYS_REPORT_PANELUPTIME:
          const uptime = cpp.SrvCom_Sys_Report_PanelUptime.decode(dataBuffer, 0, { endian: 'LE' })
          this.uptimems = uptime.uptime;
          this.uptimetime = new Date
          return true
      }
      return false
    }
    catch (error) {
      logger.error(`[Segments] BasePanel packet (${dataBuffer[1]}) error`)
      return true
    }
  }
}

module.exports = BasePanel
