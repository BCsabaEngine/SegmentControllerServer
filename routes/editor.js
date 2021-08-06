const Router = require('fastify-route-group').Router

module.exports = (fastify) => {
  const router = new Router(fastify)

  const URL_SEGMENT_ID = 'segment/:id(^\\d{1,3}$)'

  router.namespace('editor', () => {
    router.get('', async (request, reply) => { reply.redirect('/editor/layout') })
    router.namespace('layout', () => {
      router.get('', async (request, reply) => {
        const layout = layoutManager.getLayout()
        return reply.noCache().view('editor/layout',
          {
            title: 'Layout editor',
            topMargin: 64,
            blockSize: layout.blockSize,
            worldColor: layout.worldColor,
            terrainMargin: layout.terrainMargin,
            segments: layout.getAllSegments(),
            nextId: layout.getNextAvailableId(),
          })
      })
      router.namespace('add', () => {
        router.post('segment', async (request) => {
          layoutManager.getLayout().addNewSegment(Number(request.body.id), request.body.name)
          layoutManager.saveToFile()
          return JSON.empty
        })
      })
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
        router.post('segmentname', async (request) => {
          layoutManager.getLayout().setSegmentName(Number(request.body.id), request.body.name)
          layoutManager.saveToFile()
          return JSON.empty
        })
        router.post('segmentid', async (request) => {
          layoutManager.getLayout().setSegmentId(Number(request.body.id), Number(request.body.newid))
          layoutManager.saveToFile()
          return JSON.empty
        })
      })
      router.namespace('delete', () => {
        router.post('segment', async (request) => {
          layoutManager.getLayout().deleteSegmentById(Number(request.body.id))
          layoutManager.saveToFile()
          return JSON.empty
        })
      })
    })

    router.namespace(URL_SEGMENT_ID, () => {
      router.get('', async (request, reply) => {
        const layout = layoutManager.getLayout()
        const segment = layoutManager.getLayout().getSegmentById(request.params.id)
        if (!segment) throw new Error(`Segment ${request.params.id} not found`)
        return reply.noCache().view('editor/segment',
          {
            title: 'Segment editor',
            segment: segment,
            topMargin: 64,
            blockSize: layout.blockSize,
            worldColor: segment.baseColor,
            terrainMargin: layout.terrainMargin,
            segments: layout.getAllSegments(),
          })
      })
      router.namespace('set', () => {
        router.post('baseColor', async (request) => {
          const segment = layoutManager.getLayout().getSegmentById(request.params.id)
          if (!segment) throw new Error(`Segment ${request.params.id} not found`)
          // layoutManager.getLayout().setWorldColor(request.body.worldColor)
          // layoutManager.saveToFile()
          return JSON.empty
        })
        router.post('elementlocations', async (request) => {
          return JSON.empty
        })
      })
    })

  })
}
