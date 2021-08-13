const Router = require('fastify-route-group').Router
const { createCanvas } = require('canvas')

const LayoutSegmentTrack = require('../lib/layoutClasses/layoutSegmentTrack')
const LayoutSegmentTurnout = require('../lib/layoutClasses/layoutSegmentTurnout')

module.exports = (fastify) => {
  const router = new Router(fastify)

  router.namespace('glyph', () => {
    router.namespace('track', () => {
      router.get('', async (request, reply) => {
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
      router.get(':type', async (request, reply) => {
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
    router.namespace('turnout', () => {
      router.get('', async (request, reply) => {
        const layout = layoutManager.getLayout()

        const glyphs = []
        const types = LayoutSegmentTurnout.getTypes()
        for (const type in types)
          glyphs.push({
            type: type,
            name: types[type],
            url: `/glyph/turnout/${type}`,
          })
        return reply.noCache().view('glyph/show',
          {
            title: 'Turnout glyphs',
            glyphs,
            blockSize: layout.blockSize
          })
      })
      router.get(':type', async (request, reply) => {
        const type = request.params.type

        if (!(type in LayoutSegmentTurnout.getTypes()))
          throw new Error(`Invalid turnout type ${type}`)

        const layout = layoutManager.getLayout()

        const canvas = createCanvas(layout.blockSize, layout.blockSize)
        const context = canvas.getContext('2d')

        const turnout = new LayoutSegmentTurnout()
        turnout.setType(type)
        turnout.draw(context, layout, 0, 0)

        const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
        reply.type('image/png')
        return buf
      })
    })
    router.get('surface', async (request, reply) => {
      let color = request.query.color || '4080A0'
      if (!color.startsWith('#')) color = '#' + color
      const size = Number(request.query.size) || 32

      const canvas = createCanvas(size, size)
      const context = canvas.getContext('2d')

      context.fillStyle = String(color)
      context.fillRect(0, 0, size, size)

      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
      reply.type('image/png')
      return buf
    })
  })
}
