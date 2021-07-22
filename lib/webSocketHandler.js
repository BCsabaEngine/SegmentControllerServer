const EventEmitter = require('events');

class webSocketHandler extends EventEmitter {
  clients = {}
  id = 0

  handleClient(connection) {
    if (connection.id) return

    this.id++
    connection.id = this.id
    connection.channels = []

    connection.socket.on('close', function (conn) {
      delete this.clients[connection.id];
      logger.debug(`[WS] Closed #${connection.id} (${Object.keys(this.clients).length} active)`)
    }.bind(this))

    connection.socket.on('message', function (message) {
      logger.debug(`[WS] Message from #${connection.id}: ${message}`)

      const json = JSON.tryParse(message)
      if (json)
        if (json.command == 'subscribe' && json.channel) {
          connection.channels[json.channel] = new Date()
          return
        }

      this.emit('message', connection.id);
    }.bind(this))

    this.clients[this.id] = connection

    const allclients = Object.keys(this.clients).length
    logger.debug(`[WS] New connection #${this.id} (${allclients} active)`)
  }

  send(id, data) {
    if (this.clients.hasOwnProperty(id)) {
      logger.debug(`[WS] Message to #${id}: ${data}`)
      const client = this.clients[id]
      if (client && client.socket && client.socket.readyState == 1)
        client.socket.send(JSON.stringify(data))
    }
  }

  broadcast(data, channel) {
    for (const [id, client] of Object.entries(this.clients))
      if (channel) {
        data.channel = channel
        if (client.channels && client.channels.hasOwnProperty(channel))
          this.send(id, data);
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

module.exports = ws
