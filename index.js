global.APPNAME = "SegmentControllerServer"
global.APPVERSION = require('./package.json').version
global.IsProduction = (process.env.NODE_ENV === 'production')

console.log(`${APPNAME} (v${APPVERSION})`);

require('./lib/dayjsLoader')()
global.cmdline = require('./lib/cmdline')
global.config = require('./lib/config')
global.logger = require('./lib/logger')
global.rf24 = require('./lib/rf24')
global.segments = require('./lib/segments')(global.rf24)
global.http = require('./lib/http')

logger.info('Server starting...');

let state = 0
setInterval(() => {
  for (const id of segments.GetSegmentIds()) {
    const seg = segments.GetSegmentById(id)
    if (seg.IsValid()) {
      //console.log(`Segment #${id} `)
      //console.log(seg.turnout1)
      //console.log(seg.keypad)
      //seg.ambientlight1.SetLight(5, state)
      seg.ambientlight1.SetEffect(0, 2)
      //console.log(seg.ambientlight1.effects)

      state = !state
    }
  }
}, 2000)

let state2 = 0
setInterval(() => {
  for (const id of segments.GetSegmentIds()) {
    const seg = segments.GetSegmentById(id)
    if (seg.IsValid()) {
      seg.turnout1.SetTurnout(0, 2)
    }
  }
  state2 = !state2
}, 5000)
