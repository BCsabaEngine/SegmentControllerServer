//const Router = require('fastify-route-group').Router

module.exports = (fastify) => {

    fastify.get('/network/show', async (request, reply) => {
        const networkinfos = {}
        for (const id of global.segments.GetSegmentIds()) {
            const segment = global.segments.GetSegmentById(id)
            if (segment.IsValid())
                networkinfos[id] = {
                    mode: segment.GetModeAsString(),
                    panels: segment.GetValidPanels(),
                }
        }

        return reply.noCache().view('dashboardnetwork/show', {
            title: 'Network',
            networkinfos,
        })
    })

    fastify.post('/network/reboot', async (request, reply) => {
        const segmentid = Number(request.body.id)
        if (!global.segments.HasSegmentById(segmentid))
            throw new Error(`Segment ${segmentid} not found`)

        const segment = global.segments.GetSegmentById(segmentid)
        segment.Reset(false)

        return JSON.empty
    })
}