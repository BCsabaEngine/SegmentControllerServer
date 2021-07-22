require('./lib/nodeExt')

global.APPNAME = "SegmentControllerServer"
global.APPVERSION = require('./package.json').version

console.log(`${APPNAME} (v${APPVERSION})`);

require('./lib/dayjsLoader')()
global.cmdline = require('./lib/cmdline')
if (!global.cmdline.debug)
  process.env.NODE_ENV = 'production'

global.config = require('./lib/config')
global.logger = require('./lib/logger')
global.rf24 = require('./lib/rf24')
global.segments = require('./lib/segments')(global.rf24)
global.ws = require('./lib/webSocketHandler')
global.http = require('./lib/http')

logger.info('Application started');

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
