const glob = require('glob')
const path = require('path')
const fastifystatic = require('fastify-static')

const http404 = 404
const http500 = 500

module.exports = (fastify) => {

  const staticroutes = {
    '/public/': path.join(__dirname, '../public'),
    '/assets/jquery/': path.join(__dirname, '../node_modules/jquery/dist'),
    '/assets/popper/': path.join(__dirname, '../node_modules/popper.js/dist'),
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
  logger.debug(`${Object.keys(staticroutes).length} HTTP static routes initialized`)

  fastify.register(require('fastify-favicon'), { path: path.join(__dirname, '../public/favicon'), name: 'favicon.ico' })
  logger.debug(`Favicon routes initialized`)

  for (const file of glob.sync('./routes/*.js'))
    if (!file.endsWith('index.js')) {
      require(path.resolve(file))(fastify)
      logger.debug(`Routes in ${file} initialized`)
    }
}
