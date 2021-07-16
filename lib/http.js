const fastify = require('fastify')
const routeInitializer = require('../routes')

module.exports = () => {
  //const app = fastify({ logger: { level: 'info' } })
  const app = fastify({ logger: false })

  // app.set('strict routing', false)
  // app.set('trust proxy', true)

  // app.use(session({
  //   secret: os.hostname(),
  //   resave: true,
  //   saveUninitialized: true
  // }))

  // app.use(bodyParser.urlencoded({ extended: true }))
  // app.use(cookieParser(os.hostname(), { httpOnly: true }))
  // app.use(hpp())
  // app.use(express.json())
  // app.use(compression())

  // app.engine('pug', pug.__express)
  // app.set('view engine', 'pug')
  // app.set('views', path.resolve('./views'))
  // app.locals.pretty = true // readable generated HTML code

  // const origrenderfile = pug.renderFile
  // let pugnextuniquevalue = 0
  // pug.renderFile = (path, options, fn) => {
  //   options.cache = global.IsProduction
  //   options.genUnique = function () { return pugnextuniquevalue++ }
  //   options.isproduction = global.IsProduction
  //   options.dayjs = dayjs
  //   return origrenderfile(path, options, fn)
  // }

  // app.use(helmet({ contentSecurityPolicy: false }))

  routeInitializer(app)


  app.setNotFoundHandler((request, reply) => {
    //app.log.debug('Route not found: ', request.req.url)

    reply.status(404).send({ message: 'Not found' })
  })

  app.setErrorHandler((error, request, reply) => {
    //app.log.debug(`Request url: `, request.req.url)
    //app.log.debug(`Payload: `, request.body)
    //app.log.error(`Error occurred: `, error)

    reply.status(500).send({ message: 'Error occurred during request' })
  })

  app.listen(80)

  return app
}
