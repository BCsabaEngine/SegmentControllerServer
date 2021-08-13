module.exports = (fastify) => {

  fastify.get('/', async (request, reply) => {
    const layout = layoutManager.getLayout()
    return reply.noCache().view('main', {
      title: 'Dashboard',
      backColor: layout.worldColor,
      backgroundSize: layout.getImageSize(),
      layoutLastModify: layout.lastModify,
    })
  })

}
