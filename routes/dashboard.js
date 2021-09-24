const Router = require('fastify-route-group').Router

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

  const router = new Router(fastify)

  router.namespace('op/:segmentid', () => {
    router.namespace('signal/:panelindex', () => {
      router.post('toggle/:index', (request, reply) => {
        const segmentid = request.params.segmentid
        const panelindex = request.params.panelindex
        const index = request.params.index

        if (global.segments.HasSegmentById(segmentid)) {
          const signal = global.segments.GetSegmentById(segmentid).getSignal(panelindex)
          if (signal)
            signal.ToggleSignal(index)
        }
        reply.send()
      })
      router.post('set/:index/:state', (request, reply) => {
        const segmentid = request.params.segmentid
        const panelindex = request.params.panelindex
        const index = request.params.index
        const state = request.params.state

        if (global.segments.HasSegmentById(segmentid)) {
          const signal = global.segments.GetSegmentById(segmentid).getSignal(panelindex)
          if (signal)
            signal.SetSignal(index, state)
        }
        reply.send()
      })
    })
  })

}
