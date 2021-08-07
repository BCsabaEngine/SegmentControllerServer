const Router = require('fastify-route-group').Router
const { createCanvas } = require('canvas')

const LayoutSegmentTrack = require('../lib/layoutClasses/layoutSegmentTrack')

module.exports = (fastify) => {
  const router = new Router(fastify)

  router.namespace('glyph', () => {
    router.get('track', async (request, reply) => {
      const layout = layoutManager.getLayout()

      const glyphs = []
      const types = LayoutSegmentTrack.getTypes()
      for (const type in types)
        glyphs.push({
          type: type,
          name: types[type],
          url: `/glyph/track/${type}`,
        })
      return reply.noCache().view('glyph/show',
        {
          title: 'Track glyphs',
          glyphs,
          blockSize: layout.blockSize
        })
    })
    router.get('track/:type', async (request, reply) => {
      const type = request.params.type

      if (!(type in LayoutSegmentTrack.getTypes()))
        throw new Error(`Invalid track type ${type}`)

      const layout = layoutManager.getLayout()

      const canvas = createCanvas(layout.blockSize, layout.blockSize)
      const context = canvas.getContext('2d')

      const track = new LayoutSegmentTrack()
      track.setType(type)
      track.draw(context, layout, 0, 0)

      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
      reply.type('image/png')
      return buf
    })
  })
}
