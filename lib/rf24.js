const EventEmitter = require('events')
const RF24MeshSerialNode = require('rf24meshserialnode')

class RF24Handler extends EventEmitter {
  rf24bootcount = 0
  transmitstat = {
    startDate: Date.now(),
    receiveCount: 0,
    receiveSize: 0,
    sendCount: 0,
    sendSize: 0,
    receiveCountPerMin() { return Math.round(this.receiveCount / ((Date.now() - this.startDate) / 1000) * 60) },
    receiveSizePerMin() { return Math.round(this.receiveSize / ((Date.now() - this.startDate) / 1000) * 60) },
  }
  rf24node = undefined

  isConnected() { return this.rf24node && this.rf24node.isopened }

  getStat() { return this.transmitstat }

  async send(toNode, data) {
    if (!this.isConnected) return
    await this.rf24node.send(toNode, 0, data)
      .then(() => {
        this.transmitstat.sendCount += 1
        this.transmitstat.sendSize += data.length
        let bvalue = []
        for (const value of data)
          bvalue.push(value.toString(16))

        if (cmdline['debug-rf24'])
          logger.debug(`[RF24] Sent to ${toNode} with type 0 data: ${bvalue}`)
        return bvalue
      })
      .catch((error) => logger.error('[RF24] Send error: ' + error.message))
  }

  async startup(node) {
    await node.setNodeId(0)
      .then(() => node.setSpeed(0))
      .then(() => node.begin())
      .then(() => {
        logger.info('[RF24] Radio handler started')
        this.emit('startup')
        return 1
      })
      .catch((error) => logger.error('[RF24] Radio handler error : ' + error.message))
  }

  prepareNode(node) {
    node.on('reready', function () {
      this.rf24bootcount++
      logger.debug(`[RF24] Rebooted ${this.rf24bootcount} time(s)`)
      this.startup(node)
      this.emit('reboot', this.rf24bootcount)
    }.bind(this))

    node.on('close', async function () {
      this.rf24node = undefined
      logger.debug('[RF24] Closed')
      this.emit('close')
    }.bind(this))

    node.on('newnode', async function () {
      logger.debug('[RF24] New node: ' + await node.getNodelist())
      this.emit('newnode')
    }.bind(this))

    node.on('receive', async function (from, type, buffer) {
      if (from < 0 || from > 79) {
        logger.debug(`[RF24] Invalid packet from ${from}`)
        return
      }

      this.transmitstat.receiveCount += 1
      this.transmitstat.receiveSize += buffer.length

      let bvalue = []
      for (const value of buffer)
        bvalue.push(value.toString(16))

      if (cmdline['debug-rf24'])
        logger.debug(`[RF24] Data from ${from} type ${type} data: ${bvalue}`)

      this.emit('receive', from, buffer)
    }.bind(this))
  }

  StartRF24MeshNode() {
    RF24MeshSerialNode.find({
      inittimeout: 2500,
      cmdtimeout: 250
    }, async function (node) {
      if (node) {
        this.rf24node = node
        logger.info(`[RF24] Device found: ${node.portnumber}`)

        await node.getVersion()
          .then((version) => logger.debug('[RF24] Version: ' + version))
          .catch((error) => logger.error('[RF24] Version ERROR: ' + error.message))

        this.prepareNode(node)
        this.startup(node)
      }
    }.bind(this))
  }
}

const rf24handler = new RF24Handler()

if (config.rf24.enabled) {
  rf24handler.StartRF24MeshNode()

  setInterval(() => {
    if (!rf24handler.rf24node)
      rf24handler.StartRF24MeshNode()
  }, 1000)
}

module.exports = rf24handler
