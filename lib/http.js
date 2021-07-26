const Fastify = require('fastify')
const pug = require('pug')
const routeInitializer = require('../routes')
const logger = require('./logger')
const ip = require('./ip')

const fastify = Fastify({
  logger: false,
  bodyLimit: 2 * 1024 * 1024,
  trustProxy: true,
})
fastify.register(require('fastify-helmet'), { contentSecurityPolicy: false })
fastify.register(require('fastify-compress'), { global: false })
fastify.register(require('fastify-etag'))
fastify.register(require('point-of-view'), {
  engine: { pug },
  root: 'views',
  options: {
    pretty: true,
    globals: [],
  }
})

routeInitializer(fastify)

fastify.setNotFoundHandler((request, reply) => {
  logger.error(`[HTTP] 404 page not found: ${request.raw.url}`)
  reply.status(404).view('page404', { title: '404' })
})

fastify.setErrorHandler((error, request, reply) => {
  logger.error(`[HTTP] 500 server error: ${request.raw.url} | ${error.message}`)
  reply.status(500).view('page500', { title: '500', errortext: error.message })
})

const webport = config.web.port
fastify.listen(webport, '0.0.0.0')
logger.info(`[HTTP] Started on port ${webport}, open one of the addresses below:`)
const portstr = (webport == 80) ? '' : `:${webport}`
logger.info(`  http://localhost${portstr}\t\t[This computer]`)
for (const [key, value] of Object.entries(ip.getIPAddresses()))
  logger.info(`  http://${value}${portstr}\t\t[${key}]`)

module.exports = fastify
