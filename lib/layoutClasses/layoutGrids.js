const Color = require('color')

const { GridItem } = require('./grid')

class SurfaceGridItem extends GridItem {
  onInitItem(element) {
    super.onInitItem(element)
    this.color = element.color
  }
  onUpdateItem(element) {
    super.onUpdateItem(element)

    if (this.color !== element.color)
      this.color = Color(this.color).mix(Color(element.color)).hex()
  }
  draw(context, layout, segment, x, y, grid) {
    const bs = layout.blockSize
    const tm = layout.surfaceMargin

    const neighbours = grid.getNeighbours(this)

    const leftMargin = neighbours.left ? 0 : tm
    const rightMargin = neighbours.right ? 0 : tm
    const topMargin = neighbours.over ? 0 : tm
    const bottomMargin = neighbours.under ? 0 : tm

    context.fillStyle = this.color
    context.fillRect((this.x + x) * bs + leftMargin, (this.y + y) * bs + topMargin, bs - leftMargin - rightMargin, bs - topMargin - bottomMargin)

    context.fillStyle = segment.baseColor
    if (!neighbours.leftover && (neighbours.left || neighbours.over)) context.fillRect((this.x + x) * bs, (this.y + y) * bs, tm, tm)
    if (!neighbours.leftunder && (neighbours.left || neighbours.under)) context.fillRect((this.x + x) * bs, (this.y + y + 1) * bs - tm, tm, tm)
    if (!neighbours.rightover && (neighbours.right || neighbours.over)) context.fillRect((this.x + x + 1) * bs - tm, (this.y + y) * bs, tm, tm)
    if (!neighbours.rightunder && (neighbours.right || neighbours.under)) context.fillRect((this.x + x + 1) * bs - tm, (this.y + y + 1) * bs - tm, tm, tm)
  }
}

module.exports = {
  SurfaceGridItem
}
