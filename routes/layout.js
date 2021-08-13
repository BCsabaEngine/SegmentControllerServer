const Router = require('fastify-route-group').Router
const { createCanvas } = require('canvas')

module.exports = (fastify) => {
  const router = new Router(fastify)

  const URL_SEGMENT_ID = 'segment/:id(^\\d{1,3}$)'

  router.namespace('layout', () => {
    router.get('background', async (request, reply) => {
      const layout = layoutManager.getLayout()
      const imageSize = layout.getImageSize()

      const canvas = createCanvas(imageSize.width, imageSize.height)
      const context = canvas.getContext('2d')

      layout.draw(context)

      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
      reply.type('image/png')
      return buf
    })

    router.get(URL_SEGMENT_ID, async (request, reply) => {
      const id = Number(request.params.id)

      const layout = layoutManager.getLayout()
      const segment = layout.getSegmentById(id)
      if (!segment)
        throw new Error(`Segment (${request.params.id}) not found`)

      const imageSize = segment.getImageSize(layout)

      const canvas = createCanvas(imageSize.width, imageSize.height)
      const context = canvas.getContext('2d')

      segment.draw(context, layout, 0, 0)

      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
      reply.type('image/png')
      return buf
    })

  })

}
