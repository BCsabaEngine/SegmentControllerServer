const fs = require('fs')
const glob = require('glob')
const path = require('path')
//const favicon = require('serve-favicon')

const http404 = 404
const http500 = 500

module.exports = (app) => {
  // app.use(express.static('public', { index: false, maxAge: '1h', redirect: false }))
  // app.use('/dist', express.static('./node_modules/admin-lte/dist', { index: false, maxAge: '1h', redirect: false }))
  // app.use('/plugins', express.static('./node_modules/admin-lte/plugins', { index: false, maxAge: '1h', redirect: false }))
  // app.use('/bootstrap-icons/font', express.static('./node_modules/bootstrap-icons/font', { index: false, maxAge: '1h', redirect: false }))
  // app.use('/sweetalert2', express.static('./node_modules/sweetalert2/dist', { index: false, maxAge: '1h', redirect: false }))
  // app.use('/mousetrap', express.static('./node_modules/mousetrap', { index: false, maxAge: '1h', redirect: false }))
  // app.use('/clipboard', express.static('./node_modules/clipboard/dist', { index: false, maxAge: '1h', redirect: false }))
  // app.use('/vis-network/standalone', express.static('./node_modules/vis-network/standalone', { index: false, maxAge: '1h', redirect: false }))
  // app.use(favicon(path.resolve('./public/favicon.ico')))


  for (const file of glob.sync('./routes/*.js'))
    if (!file.endsWith('index.js'))
      require(path.resolve(file))(app)

  // app.Page404 = function (req, res, next) {
  //   IpBan.add404(req)
  //   res.status(http404).render('page404', { title: 'Oops 404!' })
  // }
  // app.re404 = () => { app.remove(app.Page404); app.use(app.Page404) }
  // app.re404()

}
