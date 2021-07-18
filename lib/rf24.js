const RF24MeshSerialNode = require('rf24meshserialnode');
const logger = require('./logger');

let rf24bootcount = 0
let rf24node = null

function StartRF24MeshNode() {
  RF24MeshSerialNode.find({
    inittimeout: 2500,
    cmdtimeout: 250
  }, async function (node) {
    if (node) {
      rf24node = node;
      logger.info(`[RF24] Device found: ${node.portnumber}`)

      node.on('close', async () => {
        rf24node = null;
        logger.debug('[RF24] Closed')
      })

      node.on('newnode', async () => {
        logger.debug('[RF24] New node connected: ' + await node.getNodelist())
      })

      node.on('receive', async (from, type, buffer) => {
        let bvalue = [];
        for (const value of buffer)
          bvalue.push(value.toString(16))

        logger.debug(`[RF24] Data arrived from ${from} with type ${type} data: ` + bvalue)
      })

      await node.getVersion()
        .then((version) => logger.debug('[RF24] Version: ' + version))
        .catch((error) => logger.error('[RF24] Version ERROR: ' + error.message))

      async function startup() {
        await node.setNodeId(0)
          .then(() => node.setSpeed(0))
          .then(() => node.begin())
          .then(() => logger.info('[RF24] Node started'))
          .catch((error) => logger.error('[RF24] Node start error : ' + error.message))
      }

      node.on('reready', () => {
        rf24bootcount++
        logger.debug(`[RF24] Rebooted ${rf24bootcount} time(s)`)
        startup()
      })

      startup()
    }
  })
}

// setInterval(async () => {
//   if (!rf24node || !rf24node.isopened)
//     return

//   await rf24node.send(5, 0, Buffer.from([62, 1, 2]))
//     .then(() => console.log("Sent"))
//     .catch((error) => console.log("Send ERROR: " + error.message))
// }, 150)

if (config.rf24.enabled) {
  StartRF24MeshNode()

  setInterval(() => {
    if (!rf24node)
      StartRF24MeshNode()
  }, 1000)
}

module.exports = rf24node
