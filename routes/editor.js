const Router = require('fastify-route-group').Router

module.exports = (fastify) => {
  const router = new Router(fastify)

  router.namespace('editor', () => {
    router.get('layout', async (request, reply) => {
      const layout = layoutManager.getLayout()
      return reply.noCache().view('editor/layout',
        {
          title: 'Layout editor',
          topMargin: 64,
          blockSize: layout.blockSize,
          worldColor: layout.worldColor,
          terrainMargin: layout.terrainMargin,
          segments: layout.getAllSegments(),
        })
    })
    router.namespace('layout', () => {
      router.namespace('set', () => {
        router.post('blocksize', async (request) => {
          layoutManager.getLayout().setBlockSize(Number(request.body.blockSize))
          layoutManager.saveToFile()
          return JSON.empty
        })
        router.post('worldcolor', async (request) => {
          layoutManager.getLayout().setWorldColor(request.body.worldColor)
          layoutManager.saveToFile()
          return JSON.empty
        })
        router.post('terrainmargin', async (request) => {
          layoutManager.getLayout().setTerrainMargin(Number(request.body.terrainMargin))
          layoutManager.saveToFile()
          return JSON.empty
        })
        router.post('segmentlocations', async (request) => {
          layoutManager.getLayout().setSegmentLocations(JSON.tryParse(request.body.locations))
          layoutManager.saveToFile()
          return JSON.empty
        })
      })
    })

    //router.post('layout/')

  })
}
