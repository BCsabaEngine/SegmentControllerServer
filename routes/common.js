module.exports = (fastify) => {

  fastify.get('/', async (req, reply) => {
    let counter = req.session.get('counter')
    if (isNaN(counter))
      counter = 0
    counter++
    req.session.set('counter', counter)
    console.log(counter)

    return reply.view('main', { text: 'text' })
  })

}
