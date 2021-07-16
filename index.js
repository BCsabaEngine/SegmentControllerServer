global.APPNAME = "SegmentControllerServer"
global.APPVERSION = require('./package.json').version
global.IsProduction = (process.env.NODE_ENV === 'production')

console.log(`${APPNAME} (v${APPVERSION})`);


global.cmdline = require('./lib/cmdline')
global.config = require('./lib/config')
global.logger = require('./lib/logger')
// const dayjsLoader = require('./lib/dayjsLoader')
// dayjsLoader()
const http = global.http = require('./lib/http')

logger.info('Server starting...');
http()
