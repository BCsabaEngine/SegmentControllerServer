const dayjs = require('dayjs')

module.exports = (fastify) => {

  fastify.get('/hello', async (req, reply) => {
    return reply.view('main', { text: 'text' })
  })

}
