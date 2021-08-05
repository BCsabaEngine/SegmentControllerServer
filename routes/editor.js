const Router = require('fastify-route-group').Router

module.exports = (fastify) => {
  const router = new Router(fastify)

  router.namespace('editor', () => {
    router.get('layout', async (request, reply) => {
      const layout = layoutManager.getLayout()
      const gridSize = layout.blockSize
      const segments = layout.getAllSegments()

      return reply.noCache().view('editor/layout',
        {
          title: 'Layout editor',
          topMargin: 64,
          gridSize,
          segments,
        })
    })
    router.namespace('layout', () => {
      router.namespace('set', () => {
        router.post('worldcolor', async (request, reply) => {
        })
        router.post('blocksize', async (request, reply) => {
        })
        router.post('terrainmargin', async (request, reply) => {
        })
        router.post('segmentlocations', async (request, reply) => {
          layoutManager.getLayout().setSegmentLocations(JSON.tryParse(request.body.locations))
          layoutManager.saveToFile()
          return JSON.empty
        })
      })
    })

    //router.post('layout/')

  })
}
