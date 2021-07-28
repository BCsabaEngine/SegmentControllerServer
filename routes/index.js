const path = require('path')
const fastifystatic = require('fastify-static')
const fastifysession = require('@mgcrea/fastify-session')

const SESSION_SECRET = 'This is a secret sentence for SESSION transactions';
const SESSION_TTL = 86400; // 1 day in seconds

module.exports = (fastify) => {

  fastify.register(require('fastify-formbody'))

  fastify.register(require('fastify-cookie'))
  fastify.register(fastifysession, {
    secret: SESSION_SECRET,
    cookie: { maxAge: SESSION_TTL },
  })

  const staticroutes = {
    '/public/': path.join(__dirname, '../public'),
    '/assets/jquery/': path.join(__dirname, '../node_modules/jquery/dist'),
    '/assets/popper/': path.join(__dirname, '../node_modules/@popperjs/core/dist'),
    '/assets/bootstrap/': path.join(__dirname, '../node_modules/bootstrap/dist'),
    '/assets/bootstrap-icons/': path.join(__dirname, '../node_modules/bootstrap-icons/font'),
  }
  let isfirst = true
  for (const [key, value] of Object.entries(staticroutes)) {
    fastify.register(fastifystatic, {
      prefix: key,
      root: value,
      decorateReply: isfirst
    })
    isfirst = false
  }
  logger.debug(`[HTTP] ${Object.keys(staticroutes).length} HTTP static routes initialized`)

  fastify.register(require('fastify-favicon'), { path: path.join(__dirname, '../public/favicon'), name: 'favicon.ico' })
  logger.debug(`[HTTP] Favicon routes initialized`)

  require('./common.js')(fastify)
  require('./websocket.js')(fastify)

  require('./layout.js')(fastify)
}
