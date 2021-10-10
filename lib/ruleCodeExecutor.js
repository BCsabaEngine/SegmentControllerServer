const vm = require('vm')

class RuleCodeExecutor {
  // static ParseJsCode(jscode) {
  //   const devices = []
  //   for (const device of global.runningContext.GetDevices()) {
  //     if (jscode.includes(device.name)) {
  //       if (!devices.includes(device.name)) devices.push(device.name)
  //     }
  //   }
  //   devices.sort()

  //   const keywords = []
  //   for (const keyword of [
  //     'atEveryMinute(', 'atEveryHour(',
  //     'createInterval(', 'clearInterval(', 'createTimeout(', 'clearTimeout(',
  //     'now.', 'dawn.', 'sunrise.', 'sunset.', 'dusk.',
  //     'OnceADay('
  //   ]) {
  //     if (jscode.includes(keyword)) {
  //       const kw = keyword.replace(/[(.]/g, '')
  //       if (!keywords.includes(kw)) keywords.push(kw)
  //     }
  //   }

  //   return { devices: devices, keywords: keywords }
  // }

  _timers = {};
  _intervals = {};
  _everyminutes = [];

  name = '';
  jscode = '';
  constructor(name, jscode) {
    this.name = name
    this.jscode = jscode
  }

  CreateTimeout(name, timeout, callback) {
    if (this._timers[name]) { clearTimeout(this._timers[name]) }

    const id = setTimeout(callback, timeout)
    this._timers[name] = id

    return new Date().now() + timeout
  }

  ClearTimeout(name) {
    if (this._timers[name]) {
      clearTimeout(this._timers[name])
      delete this._timers[name]
    }
  }

  CreateInterval(name, timeout, callback) {
    if (this._intervals[name]) { clearInterval(this._intervals[name]) }

    const id = setInterval(callback, timeout)
    this._intervals[name] = id
  }

  ClearInterval(name) {
    if (this._intervals[name]) {
      clearInterval(this._intervals[name])
      delete this._intervals[name]
    }
  }

  AtEveryNthMinute(minute, callback) { this._everyminutes.push({ minute, callback }) }
  AtEveryMinute(callback) { this.AtEveryNthMinute(1, callback) }

  Log(message) { logger.info(`[RuleCode - ${this.name}] ${message}`) }

  DoEveryMinute(minute) {
    for (const everyminute of this._everyminutes)
      if ((minute % everyminute.minute) === 0 && typeof everyminute.callback === 'function')
        everyminute.callback()
  }

  async Run() {
    const contextvars = new class BaseContext {
      get now() {
        (this)
        const d = new Date()
        return {
          y: d.getFullYear(),
          m: d.getMonth() + 1,
          d: d.getDate(),
          H: d.getHours(),
          M: d.getMinutes(),
          S: d.getSeconds(),
          dow: d.getDay(),
          time: d.getTime(),
          HHMM: d.getHours() * 100 + d.getMinutes(),
          HH_MM: d.getHours() + ':' + d.getMinutes().toString().padStart(2, '0')
        }
      }
    }

    contextvars.log = this.Log.bind(this)
    contextvars.createInterval = this.CreateInterval.bind(this)
    contextvars.clearInterval = this.ClearInterval.bind(this)
    contextvars.createTimeout = this.CreateTimeout.bind(this)
    contextvars.clearTimeout = this.ClearTimeout.bind(this)
    contextvars.atEveryMinute = this.AtEveryMinute.bind(this)
    contextvars.atEveryNthMinute = this.AtEveryNthMinute.bind(this)

    // this._devices = global.runningContext.GetDevices()
    // for (const device of this._devices)
    //   contextvars[device.name] = device

    try {
      const context = vm.createContext(contextvars)
      new vm.Script(this.jscode, { filename: `${this.name}.js` }).runInContext(context)

      logger.info(`[RuleCode] ${this.name} started`)
    } catch (error) {
      //global.runningContext.ReportRuleCodeExecutorError(this.id, error)
      logger.error(`[RuleCode] ${this.name} failed: ${error.message}`)
    }
  }

  Stop() {
    for (const device of this._devices) { device.RemoveAllListeners() }

    for (const key of Object.keys(this._timers))
      clearTimeout(this._timers[key])
    for (const key of Object.keys(this._intervals))
      clearInterval(this._intervals[key])

    logger.info(`[RuleCode] ${this.name} stopped`)
  }
}

module.exports = RuleCodeExecutor
