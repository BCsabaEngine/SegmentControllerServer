const Router = require('fastify-route-group').Router

module.exports = (fastify) => {

  fastify.get('/', async (request, reply) => {
    const layout = layoutManager.getLayout()
    const segments = layout.segments
    for (const segment of segments)
      for (const signal of segment.signals)
        signal.currentstate = signal.getCurrentState(segment.id)

    return reply.noCache().view('dashboard/main', {
      title: 'Dashboard',

      backColor: layout.worldColor,
      backgroundSize: layout.getImageSize(),
      layoutLastModify: layout.lastModify,

      blockSize: layout.blockSize,
      segments: segments,
    })
  })

  const router = new Router(fastify)

  router.namespace('op/:segmentid', () => {
    router.namespace('signal/:panelindex', () => {
      router.post('toggle/:index', (request, reply) => {
        const segmentid = Number(request.params.segmentid)
        const panelindex = Number(request.params.panelindex)
        const index = Number(request.params.index)

        const signal = global.segments.GetSegmentById(segmentid).getSignal(panelindex)
        if (signal)
          signal.ToggleSignal(index - 1)
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
