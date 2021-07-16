const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    description: 'Override web port'
  })
  .option('debug', {
    alias: 'd',
    description: 'Show more details in log'
  })
  .version('version')
  .help('help', 'Show this help')
  .argv

module.exports = argv
