const dayjs = require('dayjs')
const { customAlphabet } = require('nanoid')
const nanoGen = customAlphabet('1234567890abcdef', 8)

class LayoutRuleCode {
    id = nanoGen()
    name = ''
    jscode = ''

    constructor(name) {
        this.name = name
        const nowstr = dayjs().format('YYYY-MM-DD HH:mm:ss')
        this.jscode = `
// Rulecode for SegmentController
// Created ${nowstr}
        `
    }
}

module.exports = LayoutRuleCode
