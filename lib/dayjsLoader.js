const glob = require('glob')
const path = require('path')
const dayjs = require('dayjs')

module.exports = () => {
  for (const file of glob.sync('./node_modules/dayjs/plugin/*.js')) {
    const filename = path.basename(file)
    const plugin = require(`dayjs/plugin/${filename}`)
    dayjs.extend(plugin)
  }
}
