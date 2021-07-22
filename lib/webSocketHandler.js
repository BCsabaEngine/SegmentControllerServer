const EventEmitter = require('events');

class webSocketHandler extends EventEmitter {
  clients = {}
  id = 0

  handleClient(connection) {
    if (connection.id) return

    this.id++
    connection.id = this.id

    connection.socket.on('close', function (conn) {
      delete this.clients[connection.id];
      logger.debug(`[WS] Closed #${connection.id} (${Object.keys(this.clients).length} active)`)
    }.bind(this))

    connection.socket.on('message', function (message) {
      logger.debug(`[WS] Message from #${connection.id}: ${message}`)

      this.emit('message', connection.id);
    }.bind(this))

    this.clients[this.id] = connection

    const allclients = Object.keys(this.clients).length
    logger.debug(`[WS] New connection #${this.id} (${allclients} active)`)
  }

  send(id, message) {
    if (this.clients.hasOwnProperty(id)) {
      logger.debug(`[WS] Message to #${id}: ${message}`)
      const client = this.clients[id]
      if (client && client.socket && client.socket.readyState == 1)
        client.socket.send(message)
    }
  }

  broadcast(message) {
    for (const id of Object.keys(this.clients))
      this.send(id, message)
  }
}

const ws = new webSocketHandler()

// setInterval(function () {
//   ws.broadcast('alfa')
// }, 250)

module.exports = ws
