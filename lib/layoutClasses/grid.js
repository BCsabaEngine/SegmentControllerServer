class GridItem {
  x = 0
  y = 0
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Grid {
  items = []

  getItem(x, y) {
    for (const item of this.items)
      if (item.x === x && item.y === y)
        return item
    return null
  }

  hasLeftTo(x, y) { return this.getItem(x - 1, y) }
  hasRightTo(x, y) { return this.getItem(x + 1, y) }
  hasOverTo(x, y) { return this.getItem(x, y - 1) }
  hasUnderTo(x, y) { return this.getItem(x, y + 1) }

  isOverlap(x, y, w, h) {
    for (let windex = 0; windex < w; windex++)
      for (let hindex = 0; hindex < h; hindex++)
        if (this.getItem(x + windex, y + hindex))
          return true
    return false
  }

  isMatch(element) {
    if (!element) return false
    if (!('x' in element)) return false
    if (!('y' in element)) return false
    if (!('width' in element)) return false
    if (!('height' in element)) return false

    return this.isOverlap(element.x, element.y, element.width, element.height)
  }

  insert(element) {
    for (let windex = 0; windex < element.width; windex++)
      for (let hindex = 0; hindex < element.height; hindex++) {
        const item = this.getItem(element.x + windex, element.y + hindex)
        if (item) {
          if (this.onAddItem) this.onAddItem(item, element, true)
        }
        else {
          const newitem = new GridItem(element.x + windex, element.y + hindex)
          if (this.onAddItem) this.onAddItem(newitem, element, false)
          this.items.push(newitem)
        }
      }
  }

  tryInsert(element) {
    if (!element) return false

    if (this.items.length === 0) {
      this.insert(element)
      return true
    }

    if (!this.isMatch(element)) return false

    this.insert(element)
    return true
  }

  getContourLines() {
    const result = []
    for (const item of this.items) {
      if (!this.hasLeftTo(item.x, item.y)) result.push({ from: { x: item.x, y: item.y }, to: { x: item.x, y: item.y + 1 } })
      if (!this.hasRightTo(item.x, item.y)) result.push({ from: { x: item.x + 1, y: item.y }, to: { x: item.x + 1, y: item.y + 1 } })
      if (!this.hasOverTo(item.x, item.y)) result.push({ from: { x: item.x, y: item.y }, to: { x: item.x + 1, y: item.y } })
      if (!this.hasUnderTo(item.x, item.y)) result.push({ from: { x: item.x, y: item.y + 1 }, to: { x: item.x + 1, y: item.y + 1 } })
    }
    return result
  }

  static generateGridsFrom(gridclass, elements) {
    if (!elements || elements.length === 0) return []

    const result = []
    const _elements = [...elements]

    const firstGrid = new gridclass()
    firstGrid.insert(_elements.shift())
    result.push(firstGrid)

    while (_elements.length > 0)
      for (let index = _elements.length - 1; index >= 0; index--) {
        let inserted = false
        for (const grid of result)
          if (grid.tryInsert(_elements[index])) {
            _elements.splice(index, 1)
            inserted = true
          }
        if (!inserted) {
          const grid = new gridclass()
          grid.insert(_elements[index])
          result.push(grid)
          _elements.splice(index, 1)
        }
      }

    //result.push()

    return result
  }
}

class TerrainGrid extends Grid {
  isMatch(element) { return super.isMatch(element) }

  onAddItem(item, element, overwrite) {
    this
    //console.log(element)
    item.color = '#444'
    //item.color = overwrite ? (item.color + element.color) : element.color
  }
}

module.exports = { TerrainGrid }