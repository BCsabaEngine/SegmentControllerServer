require('./lib/nodeExt')

global.APPNAME = "SegmentControllerServer"
global.APPVERSION = require('./package.json').version

console.log(`${APPNAME} (v${APPVERSION})`)

require('./lib/dayjsLoader')()
global.cmdline = require('./lib/cmdline')
if (!global.cmdline.debug)
  process.env.NODE_ENV = 'production'

global.config = require('./lib/config')
global.logger = require('./lib/logger')
global.rf24 = require('./lib/rf24')
global.segments = require('./lib/segments')(global.rf24)
global.ws = require('./lib/webSocketHandler')
global.layout = require('./lib/layout')
global.http = require('./lib/http')

// let state = 0
// setInterval(() => {
//   for (const id of segments.GetSegmentIds()) {
//     const seg = segments.GetSegmentById(id)
//     if (seg.IsValid()) {
//       //console.log(`Segment #${id} `)
//       console.log(seg.turnout1.turnoutStates)
//       //console.log(seg.keypad)
//       //seg.ambientlight1.SetLight(5, state)
//       //seg.ambientlight1.SetEffect(0, 2)
//       //console.log(seg.ambientlight1.effects)

//       state = !state
//     }
//   }
// }, 1000)

// let state2 = 0
// setInterval(() => {
//   for (const id of segments.GetSegmentIds()) {
//     const seg = segments.GetSegmentById(id)
//     if (seg.IsValid()) {
//       // const state = {
//       //   bulb_a: state2 ? 3 : 0,
//       //   bulb_b: state2 ? 0 : 2,
//       //   bulb_c: state2 ? 0 : 3,
//       //   bulb_d: state2 ? 3 : 0,
//       // }
//       // seg.signal1.SetSignalPattern(0, state)

//       seg.ambientlight1.ToggleEffect(0)
//     }
//   }
//   state2 = !state2
// }, 1500)

const sarud = segments.GetSegmentById(5)
sarud.on('online', () => { console.log('Sarud: ONLINE') })
sarud.signal.on('uptime', (uptime) => console.log(`Uptime: ${uptime}ms`))
sarud.signal.on('version', (versioninfo) => console.log(`Version: ${versioninfo}`))
sarud.signal.on('change', (index, state) => console.log(`${index} changed: ${require('util').inspect(state, false, 0, false)}`))
sarud.keypad.on('switchchange', (index, state) => console.log(`${index} switch changed: ${require('util').inspect(state, false, 0, false)}`))
sarud.keypad.on('buttonpress', (index, islong) => console.log(`${index} button pressed: ${islong}`))
sarud.keypad.on('buttonshortpress', (index) => console.log(`${index} button short pressed`))
sarud.keypad.on('buttonlongpress', (index) => console.log(`${index} button long pressed`))

// setInterval(() => {
//   for (const id of segments.GetSegmentIds()) {
//     const seg = segments.GetSegmentById(id)
//     console.log(seg.signal1.signalStates[0])
//   }
// }, 10 * 1000)
