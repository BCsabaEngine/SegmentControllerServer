const dayjs = require('dayjs')

module.exports = (fastify) => {

  fastify.get('/', async (req, reply) => {
    return reply.view('main', { text: 'text' })
  })

  fastify.get('/a', async (req, reply) => {
    return reply.view('main', { text: 'text' })
  })

  fastify.get('/b', async (req, reply) => {
    return reply.view('main', { text: 'text' })
  })

}
