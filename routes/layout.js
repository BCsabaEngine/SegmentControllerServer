const Router = require('fastify-route-group').Router

module.exports = (fastify) => {

  const router = new Router(fastify)
  router.namespace('layout', () => {

    router.get('track/:x/:y', async (request, reply) => {
      const x = Number(request.params.x) || 0
      const y = Number(request.params.y) || 0

      console.log([x, y])

      const track = layout.getLayout().segments[0].findTrack(x, y)
      console.log(track)
      if (track) {
        const { createCanvas } = require('canvas')

        const canvas = createCanvas(32, 32)
        const context = canvas.getContext('2d')

        track.draw(context)

        const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
        reply.type('image/png')
        return buf
      }
      return reply.send(new Error('Track not found'))
    })

    router.get('box', async (request, reply) => {
      const { createCanvas } = require('canvas')

      const canvas = createCanvas(200, 200)
      const context = canvas.getContext('2d')

      context.fillStyle = '#707070'
      context.fillRect(0, 0, 200, 200)

      context.fillStyle = '#A0A0A0'
      context.fillRect(10, 10, 180, 180)

      context.font = '30px Impact'
      context.rotate(0.1)
      context.fillStyle = '#FF0000'
      context.fillText('Awesome!', 50, 100)

      var text = context.measureText('Awesome!')
      context.strokeStyle = 'rgba(100,200,100,0.9)'
      context.beginPath()
      context.lineTo(50, 102)
      context.lineTo(50 + text.width, 102)
      context.stroke()

      //const buf = canvas.toBuffer('image/jpeg', { quality: 0.9 })
      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })

      reply.type('image/png')
      return buf
    })

    router.get('circle', async (request, reply) => {
      const { createCanvas } = require('canvas')

      const canvas = createCanvas(32, 32)
      const context = canvas.getContext('2d')

      //ctx.clearRect(0, 0, 32, 32)

      context.arc(16, 16, 16, 0, Math.PI * 2)

      //ctx.strokeStyle = 'rgba(100,200,100,0.9)'
      context.fillStyle = '#F00000'
      context.fill()

      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })

      reply.type('image/png')
      return buf
    })
  })

}
