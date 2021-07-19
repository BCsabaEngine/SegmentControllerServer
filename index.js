global.APPNAME = "SegmentControllerServer"
global.APPVERSION = require('./package.json').version
global.IsProduction = (process.env.NODE_ENV === 'production')

console.log(`${APPNAME} (v${APPVERSION})`);

require('./lib/dayjsLoader')()
global.cmdline = require('./lib/cmdline')
global.config = require('./lib/config')
global.logger = require('./lib/logger')
global.rf24 = require('./lib/rf24')
global.http = require('./lib/http')

logger.info('Server starting...');
