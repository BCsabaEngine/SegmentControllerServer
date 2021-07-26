const fs = require('fs')
const path = require('path')
const TypeSerializer = require('./typeSerializer')
const layoutClasses = require('./layoutClasses')
const {
  Layout,
  LayoutSegment,
  LayoutSegmentTrack, LayoutSegmentSignal,
  LayoutSegmentTerrain, LayoutSegmentBuilding
} = layoutClasses

const LAYOUT_FILEEXTENSION = '.layout'

class LayoutManager {
  layoutFilename = ''
  layout = new Layout()
  serializer = new TypeSerializer()
  constructor(layoutname) {

    this.serializer.registerClass(layoutClasses)

    if (!layoutname)
      layoutname = 'default.layout'

    if (path.extname(layoutname) !== LAYOUT_FILEEXTENSION)
      layoutname += LAYOUT_FILEEXTENSION

    if (!path.isAbsolute(layoutname))
      layoutname = path.join(config.folderConfig, layoutname)
    this.layoutFilename = layoutname

    this.loadFromFile()
  }

  loadFromFile() {
    if (fs.existsSync(this.layoutFilename)) {
      try {
        const jsondata = fs.readFileSync(this.layoutFilename)
        this.layout = this.serializer.parse(jsondata)
        logger.info(`[Layout] Loaded (${this.layout.segments.length} segments)${cmdline.debug ? ` from ${this.layoutFilename}` : ''}`)
      }
      catch (error) {
        this.generateDefaultLayout()
        if (this.archiveFile())
          this.saveToFile()
        logger.error(`[Layout] Cannot load layout, archived and recreated${cmdline.debug ? ` error ${error}` : ''}`)
      }
    }
    else {
      logger.info(`[Layout] Cannot find layout, generate default${cmdline.debug ? ` and saved to ${this.layoutFilename}` : ''}`)
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
      logger.error(`[Layout] Cannot archive layout${cmdline.debug ? ` error ${error}` : ''}`)
      return false
    }
  }

  saveToFile() {
    try {
      const json = this.serializer.stringify(this.layout, 2)
      fs.writeFileSync(this.layoutFilename, json)
    }
    catch (error) {
      logger.error(`[Layout] Cannot save layout${cmdline.debug ? ` error ${error}` : ''}`)
    }
  }

  generateDefaultLayout() {

    const seg1 = new LayoutSegment()
    seg1.tracks.push(new LayoutSegmentTrack())
    seg1.tracks.push(new LayoutSegmentTrack())
    seg1.terrains.push(new LayoutSegmentTerrain())
    seg1.terrains.push(new LayoutSegmentTerrain())

    const seg2 = new LayoutSegment()
    seg2.tracks.push(new LayoutSegmentTrack())
    seg2.terrains.push(new LayoutSegmentTerrain())

    this.layout.segments.push(seg1)
    this.layout.segments.push(seg2)
  }
}

module.exports = new LayoutManager(config.layout)
