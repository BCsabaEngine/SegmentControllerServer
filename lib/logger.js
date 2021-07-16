const path = require('path')
const dayjs = require('dayjs')
const winston = require('winston')

const nowformat = dayjs().format('YYYY-MM-DD HHmmss')

const logger = winston.createLogger({
  level: cmdline.debug ? 'debug' : 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(config.folderLog, `${nowformat}.error.log`), level: 'error' }),
    new winston.transports.File({ filename: path.join(config.folderLog, `${nowformat}.log`) })
  ]
})

module.exports = logger
