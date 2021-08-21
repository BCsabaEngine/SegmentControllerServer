require('./lib/nodeExtension')

global.APPNAME = 'SegmentControllerServer'
global.APPVERSION = require('./package.json').version

console.log(`${global.APPNAME} (v${global.APPVERSION})`)

require('./lib/dayjsLoader')
global.cmdline = require('./lib/cmdline')
if (!cmdline.debug)
  process.env.NODE_ENV = 'production'

global.runtimeConfig = require('./lib/runtimeConfig')
global.config = require('./lib/config')
global.logger = require('./lib/logger')
global.rf24 = require('./lib/rf24')
global.segments = require('./lib/segments')(global.rf24)
global.ws = require('./lib/webSocketHandler')
global.layoutManager = require('./lib/layoutManager')
global.http = require('./lib/http')

const gracefullyClose = async function gfClose(signal) {
  console.log(`[Process] Bye (${signal})...`)

  const forceClose = setTimeout(() => process.exit(1), 1500)

  if (http)
    http.close()
      .then(() => {
        console.log('[HTTP] Server closed')
        clearTimeout(forceClose)
        return process.exit(0)
      })
      .catch((error) => {
        console.log(`[HTTP] Server close error: ${error}`)
        return process.exit(1)
      })
}
process.on('SIGTERM', gracefullyClose)
process.on('SIGINT', gracefullyClose)
process.on('SIGUSR2', gracefullyClose)


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

//const sarud = segments.GetSegmentById(5)
// sarud.on('online', () => { console.log('Sarud: ONLINE') })
// sarud.signal.on('uptime', (uptime) => console.log(`Uptime: ${uptime}ms`))
// sarud.signal.on('version', (versioninfo) => console.log(`Version: ${versioninfo}`))
// sarud.signal.on('change', (index, state) => console.log(`${index} changed: ${require('util').inspect(state, false, 0, false)}`))
// sarud.keypad.on('switchchange', (index, state) => console.log(`${index} switch changed: ${require('util').inspect(state, false, 0, false)}`))
// sarud.keypad.on('buttonpress', (index, islong) => console.log(`${index} button pressed: ${islong ? 'long' : 'short'}`))
// sarud.keypad.on('buttonshortpress', (index) => console.log(`${index} button short pressed`))
// sarud.keypad.on('buttonlongpress', (index) => console.log(`${index} button long pressed`))


//sarud.on('event', (...arguments_) => { console.log(arguments_) })

segments.on('event', (...arguments_) => { console.log(arguments_) })

// setInterval(() => {
//   console.log('Toggle signal')
//   const sarud = segments.GetSegmentById(5)
//   sarud.signal.ToggleSignal(5)
// }, 5 * 1000)
// setInterval(() => {
//   console.log('PLAY')
//   const sarud = segments.GetSegmentById(5)
//   sarud.sound.Play(1)
//   setTimeout(() => {
//     console.log('STOP')
//     const sarud = segments.GetSegmentById(5)
//     sarud.sound.Stop()
//   }, 4 * 1000)
// }, 10 * 1000)
// setTimeout(() => {
//   console.log('STOP')
//   const sarud = segments.GetSegmentById(5)
//   sarud.sound.Stop()
// }, 12 * 1000)


// setInterval(() => {
//   for (const id of segments.GetSegmentIds()) {
//     const seg = segments.GetSegmentById(id)
//     console.log(seg.signal1.signalStates[0])
//   }
// }, 10 * 1000)

// setInterval(() => {
//   console.log('Rec: ' + rf24.getStat().receiveCount)
//   console.log('Rec size: ' + rf24.getStat().receiveSize)
//   console.log('Rec/min: ' + rf24.getStat().receiveCountPerMin())
//   console.log('Rec size/min: ' + rf24.getStat().receiveSizePerMin())
// }, 1 * 1000)

// function measureLag(iteration) {
//   const start = Date.now()
//   setTimeout(() => {
//     const lag = Date.now() - start
//     if (lag > 50)
//       console.log(`Loop ${iteration} took\t${lag} ms`)
//     measureLag(iteration + 1)
//   })
// }
// measureLag(1)