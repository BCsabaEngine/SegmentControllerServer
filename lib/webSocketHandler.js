const inspect = require('util').inspect
const EventEmitter = require('events')

class webSocketHandler extends EventEmitter {
  id = 0
  clients = {}

  getNextId() { return ++this.id }
  handleClient(connection) {
    if (connection.id) return

    connection.id = this.getNextId()
    connection.date = new Date()
    connection.counter = { received: 0, sent: 0 }
    connection.channels = []

    connection.socket.on('close', function (conn) {
      delete this.clients[connection.id]
      if (cmdline['debug-ws'])
        logger.debug(`[WS] Closed #${connection.id} after ${new Date() - connection.date}ms with ${connection.counter.sent} sent and ${connection.counter.received} received messages (${Object.keys(this.clients).length} active)`)
    }.bind(this))

    connection.socket.on('message', function (message) {
      if (cmdline['debug-ws'])
        logger.debug(`[WS] Message from #${connection.id}: ${inspect(message, false, 0, false)}`)
      connection.counter.received += 1

      const json = JSON.tryParse(message)
      if (json)
        if (json.command == 'subscribe' && json.channel) {
          connection.channels[json.channel] = new Date()
          return
        }

      this.emit('message', connection.id, message)
    }.bind(this))

    this.clients[connection.id] = connection

    const allclients = Object.keys(this.clients).length
    if (cmdline['debug-ws'])
      logger.debug(`[WS] New connection #${connection.id} (${allclients} active)`)
  }

  send(id, data) {
    if (this.clients.hasOwnProperty(id)) {
      if (cmdline['debug-ws'])
        logger.debug(`[WS] Message to #${id}: ${inspect(data, false, 0, false)}`)
      const client = this.clients[id]
      if (client && client.socket && client.socket.readyState == 1) {
        client.socket.send(JSON.stringify(data))
        client.counter.sent += 1
      }
    }
  }

  broadcast(data, channel) {
    for (const [id, client] of Object.entries(this.clients))
      if (channel) {
        data.channel = channel
        if (client.channels && client.channels.hasOwnProperty(channel))
          this.send(id, data)
      }
      else
        this.send(id, data)
  }
}

const ws = new webSocketHandler()

setInterval(function () {
  ws.broadcast({ a: 12 }, 'a')
}, 250)

setInterval(function () {
  ws.broadcast({ b: 42 }, 'b')
}, 250)

setInterval(function () {
  ws.broadcast({ csaba: 1979 })
}, 550)

module.exports = ws
