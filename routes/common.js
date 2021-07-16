const dayjs = require('dayjs')

module.exports = (app) => {

  app.get('/hello', (req, reply) => {
    app.log.info('Sending hello')

    reply.send({ greet: 'hello' })
  })
}
