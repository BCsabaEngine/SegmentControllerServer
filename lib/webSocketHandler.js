const inspect = require('util').inspect
const EventEmitter = require('events')

class webSocketHandler extends EventEmitter {
  id = 0
  clients = new Map()

  getNextId() { return ++this.id }
  handleClient(connection) {
    if (connection.id) return

    connection.id = this.getNextId()
    connection.date = new Date()
    connection.counter = { received: 0, sent: 0 }
    connection.channels = new Map()

    connection.socket.on('close', function () {
      this.clients.delete(connection.id)
      if (cmdline['debug-ws'])
        logger.debug(`[WS] Closed #${connection.id} after ${new Date() - connection.date}ms with ${connection.counter.sent} sent and ${connection.counter.received} received messages (${this.clients.size} active)`)
    }.bind(this))

    connection.socket.on('message', function (message) {
      if (cmdline['debug-ws'])
        logger.debug(`[WS] Message from #${connection.id}: ${inspect(message, false, 0, false)}`)
      connection.counter.received += 1

      const json = JSON.tryParse(message)
      if (json)
        if (json.command === 'subscribe' && json.channel) {
          connection.channels.set(json.channel, new Date())
          return
        }

      this.emit('message', connection.id, message)
    }.bind(this))

    this.clients.set(connection.id, connection)

    if (cmdline['debug-ws'])
      logger.debug(`[WS] New connection #${connection.id} (${this.clients.size} active)`)
  }

  send(id, data) {
    if (this.clients.has(id)) {
      if (cmdline['debug-ws'])
        logger.debug(`[WS] Message to #${id}: ${inspect(data, false, 0, false)}`)
      const client = this.clients.get(id)
      if (client && client.socket && client.socket.readyState === 1) {
        client.socket.send(JSON.stringify(data))
        client.counter.sent += 1
      }
    }
  }

  broadcast(data, channel) {
    for (const [id, client] of this.clients.entries())
      if (channel) {
        data.channel = channel
        if (client.channels && client.channels.has(channel))
          this.send(id, data)
      }
      else
        this.send(id, data)
  }
}

const wsRes = new webSocketHandler()

setInterval(function () {
  wsRes.broadcast({ a: 12 }, 'a')
}, 250)

setInterval(function () {
  wsRes.broadcast({ b: 42 }, 'b')
}, 250)

setInterval(function () {
  wsRes.broadcast({ csaba: 1979 })
}, 550)

module.exports = wsRes
