const dayjs = require('dayjs')
const Router = require('fastify-route-group').Router

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

  const router = new Router(fastify);
  router.namespace('methods', () => {
    router.prefix('posts.', () => {
      router.get('get', (_, reply) => {
        return reply.view('main', { text: 'text' })
      });
    });
    router.prefix('photos.', () => {
      router.get('get', (_, reply) => {
        return reply.view('main', { text: 'text' })
      });
    });
  });

}
