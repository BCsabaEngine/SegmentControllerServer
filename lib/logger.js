const fs = require('fs')
const path = require('path')
const glob = require('glob')
const dayjs = require('dayjs')
const winston = require('winston')

const nowformat = dayjs().format('YYYY-MM-DD HHmmss')
const todayformat = dayjs().format('YYYY-MM-DD')

const logger = winston.createLogger({
  level: cmdline.debug ? 'debug' : 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(config.folderLog, `${nowformat}.error.log`), level: 'error' }),
    new winston.transports.File({ filename: path.join(config.folderLog, `${nowformat}.log`) })
  ]
})

logger.removeOldLogs = () => {
  const folderLogArchive = path.join(config.folderLog, 'archive')
  logger.debug('Archiving old log files')
  try {
    fs.mkdirSync(folderLogArchive, { recursive: true })

    for (const file of glob.sync(path.join(config.folderLog, '*.log'))) {
      const filename = path.basename(file)
      if (!filename.startsWith(todayformat)) {
        const date = filename.substr(0, 'YYYY-MM-DD'.length)
        const folderLogArchiveDate = path.join(folderLogArchive, date)
        fs.mkdirSync(folderLogArchiveDate, { recursive: true })
        fs.renameSync(file, path.join(folderLogArchiveDate, filename))
      }
    }
  }
  catch (error) {
    logger.error(`Cannot archive logs because ${error.message}`)
  }
}

logger.removeOldLogs()

module.exports = logger
