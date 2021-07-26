const Router = require('fastify-route-group').Router

module.exports = (fastify) => {

  const router = new Router(fastify);
  router.namespace('layout', () => {
    router.get('box', async (req, reply) => {
      const { createCanvas } = require('canvas')

      const canvas = createCanvas(200, 200)
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = "#707070"
      ctx.fillRect(0, 0, 200, 200);

      ctx.fillStyle = "#A0A0A0"
      ctx.fillRect(10, 10, 180, 180);

      ctx.font = '30px Impact'
      ctx.rotate(0.1)
      ctx.fillStyle = "#FF0000"
      ctx.fillText('Awesome!', 50, 100)

      var text = ctx.measureText('Awesome!')
      ctx.strokeStyle = 'rgba(100,200,100,0.9)'
      ctx.beginPath()
      ctx.lineTo(50, 102)
      ctx.lineTo(50 + text.width, 102)
      ctx.stroke()

      //const buf = canvas.toBuffer('image/jpeg', { quality: 0.9 })
      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })

      reply.type('image/png')
      return buf
    });
    router.get('circle', async (req, reply) => {
      const { createCanvas } = require('canvas')

      const canvas = createCanvas(32, 32)
      const ctx = canvas.getContext('2d')

      //ctx.clearRect(0, 0, 32, 32)

      ctx.arc(16, 16, 16, 0, Math.PI * 2);

      //ctx.strokeStyle = 'rgba(100,200,100,0.9)'
      ctx.fillStyle = "#F00000"
      ctx.fill()

      const buf = canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })

      reply.type('image/png')
      return buf
    });
  });

}
