const fs = require('fs')
const path = require('path')
const TypeSerializer = require('./typeSerializer')
const layoutClasses = require('./layoutClasses')
const {
  Layout,
  LayoutSegment,
  //LayoutSegmentTrack, LayoutSegmentSignal,
  //LayoutSegmentTerrain, LayoutSegmentBuilding
} = layoutClasses
const countries = require('./countries')

const LAYOUT_FILEEXTENSION = '.layout'

class LayoutManager {
  layoutFilename = ''
  layout = new Layout()
  serializer = new TypeSerializer()

  constructor(layoutname) {

    this.serializer.registerClasses(layoutClasses)

    if (!layoutname)
      layoutname = 'default.layout'

    if (path.extname(layoutname) !== LAYOUT_FILEEXTENSION)
      layoutname += LAYOUT_FILEEXTENSION

    if (!path.isAbsolute(layoutname))
      layoutname = path.join(config.folderConfig, layoutname)
    this.layoutFilename = layoutname

    this.loadFromFile()
  }

  getLayout() { return this.layout }

  loadFromFile() {
    if (fs.existsSync(this.layoutFilename) && 1 === 0) {
      try {
        const jsondata = fs.readFileSync(this.layoutFilename)
        this.layout = this.serializer.parse(jsondata)
        const loggerinfosuccess = cmdline.debug ? ` from ${this.layoutFilename}` : ''
        logger.info(`[Layout] Loaded (${this.layout.segments.length} segments)${loggerinfosuccess}`)
      }
      catch (error) {
        this.generateDefaultLayout()
        if (this.archiveFile())
          this.saveToFile()
        const loggerinfoerror = cmdline.debug ? ` error ${error}` : ''
        logger.error(`[Layout] Cannot load layout, archived and recreated${loggerinfoerror}`)
      }
    }
    else {
      const loggerinfodefault = cmdline.debug ? ` and saved to ${this.layoutFilename}` : ''
      logger.info(`[Layout] Cannot find layout, generate default${loggerinfodefault}`)

      this.generateDefaultLayout()
      this.saveToFile()
    }
  }

  archiveFile() {
    try {
      if (fs.existsSync(this.layoutFilename)) {
        let index = 1
        const targetFilename = () => `${this.layoutFilename}.archive${index}`
        while (fs.existsSync(targetFilename()))
          index++
        fs.renameSync(this.layoutFilename, targetFilename())
      }
      return true
    }
    catch (error) {
      const loggerinfoerror = cmdline.debug ? ` error ${error}` : ''
      logger.error(`[Layout] Cannot archive layout${loggerinfoerror}`)
      return false
    }
  }

  saveToFile() {
    try {
      this.layout.lastModify = Date.now()
      this.layout.normalize()
      const json = this.serializer.stringify(this.layout, 2)
      fs.writeFileSync(this.layoutFilename, json)
    }
    catch (error) {
      const loggerinfoerror = cmdline.debug ? ` error ${error}` : ''
      logger.error(`[Layout] Cannot save layout${loggerinfoerror}`)
    }
  }

  generateDefaultLayout() {

    const SIZE = 10

    const segA = LayoutSegment.generateRandom(SIZE, 0)
    segA.x = 0
    segA.y = 0
    segA.id = 1
    segA.name = countries.getRandomEuCapital()

    const segB = LayoutSegment.generateRandom(SIZE, 1)
    segB.x = SIZE
    segB.y = 0
    segB.id = 2
    segB.name = countries.getRandomEuCapital()

    const segC = LayoutSegment.generateRandom(SIZE, 2)
    segC.x = 0
    segC.y = SIZE
    segC.id = 5
    segC.name = countries.getRandomEuCapital()

    this.layout.segments.push(segA, segB, segC)
  }
}

module.exports = new LayoutManager(config.layout)
