module.exports = (fastify) => {

  fastify.get('/', async (request, reply) => {
    const layout = layoutManager.getLayout()
    return reply.noCache().view('dashboard/main', {
      title: 'Dashboard',

      backColor: layout.worldColor,
      backgroundSize: layout.getImageSize(),
      layoutLastModify: layout.lastModify,

      blockSize: layout.blockSize,
      segments: layout.segments,
    })
  })

}
