class TypeSerializer {
  classes = new Map()

  isObject(o) { return (!!o) && (o.constructor === Object) }

  addClass(...classes) {
    for (const type of classes)
      this.classes.set(type.name, type)
  }

  stringify_replacer(key, value) {
    const constructorname = typeof value === 'object' ? value.constructor.name : ''
    if (constructorname && this.classes.has(constructorname))
      return Object.assign({ '$type': constructorname }, value)
    return value
  }
  stringify(value, space) { return JSON.stringify(value, this.stringify_replacer.bind(this), space) }

  parse_reviver(key, value) {
    if (value && this.isObject(value) && value['$type']) {
      const typename = value['$type']
      if (this.classes.has(typename)) {
        const instance = Object.assign(new (this.classes.get(typename))(), value)
        delete instance['$type']
        return instance
      }
    }
    return value
  }
  parse(text) { return JSON.parse(text, this.parse_reviver.bind(this)) }

}

module.exports = TypeSerializer
