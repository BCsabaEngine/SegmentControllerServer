const fastifywebsocket = require('fastify-websocket')

module.exports = (fastify) => {
  fastify.register(fastifywebsocket, { options: { maxPayload: 1024 } })

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    connection.socket.on('message', () => {
      global.ws.handleClient(connection)
    })
  })
}