const Router = require('fastify-route-group').Router

const LayoutSegmentTrack = require('../lib/layoutClasses/layoutSegmentTrack')
const LayoutSegmentTurnout = require('../lib/layoutClasses/layoutSegmentTurnout')
const LayoutSegmentSignal = require('../lib/layoutClasses/layoutSegmentSignal')
const LayoutSegmentSurface = require('../lib/layoutClasses/layoutSegmentSurface')

const PUG_GLYPHSHOW = 'glyph/show'

module.exports = (fastify) => {
  const router = new Router(fastify)

  // eslint-disable-next-line sonarjs/cognitive-complexity
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
        return reply.noCache().view(PUG_GLYPHSHOW,
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

        reply.type('image/png')
        return new LayoutSegmentTrack(0, 0, type).getImage(layout)
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
        return reply.noCache().view(PUG_GLYPHSHOW,
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

        reply.type('image/png')
        return new LayoutSegmentTurnout(0, 0, 0, 0, type).getImage(layout)
      })
    })
    router.namespace('signal', () => {
      router.get('', async (request, reply) => {
        const layout = layoutManager.getLayout()

        const glyphs = []
        const types = LayoutSegmentSignal.getTypes()
        for (const type in types)
          for (const bulb of ['W', 'RG', 'GYR', 'GYRY', 'RGRY'])
            glyphs.push(
              {
                type: type,
                name: `${types[type]} ${bulb}`,
                url: `/glyph/signal/${type}/${bulb}`,
              })
        return reply.noCache().view(PUG_GLYPHSHOW,
          {
            title: 'Signal glyphs [GYR, GYRY, RGRY]',
            glyphs,
            blockSize: layout.blockSize
          })
      })
      router.get(':type/:bulbs', async (request, reply) => {
        const type = request.params.type
        const bulbs = request.params.bulbs

        if (!(type in LayoutSegmentSignal.getTypes()))
          throw new Error(`Invalid signal type ${type}`)
        if (!(LayoutSegmentSignal.isValidBulbs(bulbs)))
          throw new Error(`Invalid signal bulbs ${bulbs}`)

        const layout = layoutManager.getLayout()

        reply.type('image/png')
        return new LayoutSegmentSignal(0, 0, 0, 0, type, bulbs).getImage(layout)
      })
    })
    router.get('surface', async (request, reply) => {
      let color = request.query.color || '4080A0'
      if (!color.startsWith('#')) color = '#' + color
      const size = Number(request.query.size) || 32

      reply.type('image/png')
      return LayoutSegmentSurface.getSquareImage(size, color)
    })
  })
}
