const fs = require('fs')
const path = require('path')
const TypeSerializer = require('./typeSerializer')
const layoutClasses = require('./layoutClasses')
const {
  Layout,
  LayoutSegment,
  LayoutSegmentTrack, //LayoutSegmentSignal,
  LayoutSegmentTerrain, LayoutSegmentBuilding
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
    if (fs.existsSync(this.layoutFilename)) {
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
      for (const segment of this.layout.segments)
        segment.autoCalcSize()
      const json = this.serializer.stringify(this.layout, 2)
      fs.writeFileSync(this.layoutFilename, json)
    }
    catch (error) {
      const loggerinfoerror = cmdline.debug ? ` error ${error}` : ''
      logger.error(`[Layout] Cannot save layout${loggerinfoerror}`)
    }
  }

  generateDefaultLayout() {

    const segA = new LayoutSegment()
    segA.name = countries.getRandomEuCapital()
    segA.tracks.push(new LayoutSegmentTrack(), new LayoutSegmentTrack())
    segA.terrains.push(
      new LayoutSegmentTerrain(10, 10, 20, 20),
      new LayoutSegmentTerrain(15, 15, 5, 5),
    )
    segA.buildings.push(
      new LayoutSegmentBuilding(20, 20, 7, 2, ''),
      new LayoutSegmentBuilding(45, 45, 15, 3, ''),
    )

    const segB = new LayoutSegment()
    segB.name = countries.getRandomEuCapital()
    segB.tracks.push(new LayoutSegmentTrack())
    segB.terrains.push(new LayoutSegmentTerrain())

    this.layout.segments.push(segA, segB)
  }
}

module.exports = new LayoutManager(config.layout)
