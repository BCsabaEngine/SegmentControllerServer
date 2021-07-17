const Fastify = require('fastify')
const pug = require('pug')
const routeInitializer = require('../routes')
const logger = require('./logger')
const ip = require('./ip')

module.exports = () => {
  const fastify = Fastify({
    logger: false,
    bodyLimit: 2 * 1024 * 1024,
    trustProxy: true,
  })
  fastify.register(require('fastify-helmet'), { contentSecurityPolicy: false })
  fastify.register(require('fastify-compress'), { global: false })
  fastify.register(require('fastify-etag'))
  fastify.register(require('point-of-view'), { engine: { pug }, root: 'views' })

  routeInitializer(fastify)

  fastify.setNotFoundHandler((request, reply) => {
    //app.log.debug('Route not found: ', request.req.url)

    reply.status(404).send({ message: 'Not found' })
  })

  fastify.setErrorHandler((error, request, reply) => {
    //app.log.debug(`Request url: `, request.req.url)
    //app.log.debug(`Payload: `, request.body)
    //app.log.error(`Error occurred: `, error)

    reply.status(500).send({ message: 'Error occurred during request' })
  })

  const webport = config.web.port
  fastify.listen(webport, '0.0.0.0')
  logger.info(`HTTP started on port ${webport}`)

  logger.info(`Open one of the addresses below:`)
  const portstr = (webport == 80) ? '' : `:${webport}`
  logger.info(`http://localhost${portstr}\t\t[This computer]`);
  for (const [key, value] of Object.entries(ip.getIPAddresses()))
    logger.info(`http://${value}${portstr}\t\t[${key}]`);

  return fastify
}
