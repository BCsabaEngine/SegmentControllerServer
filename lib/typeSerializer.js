class TypeSerializer {
  classes = new Map()

  isClass(c) { return typeof c === 'function' && /^\s*class\s+/.test(c.toString()) }
  isObject(o) { return (!!o) && (o.constructor === Object) }

  registerClass(...classes) {
    for (const cls of classes)
      if (Array.isArray(cls)) {
        for (const c of cls)
          if (this.isClass(c))
            this.classes.set(c.name, c)
      }
      else if (this.isObject(cls)) {
        for (const k in cls)
          if (this.isClass(cls[k]))
            this.classes.set(cls[k].name, cls[k])
      }
      else
        if (this.isClass(cls))
          this.classes.set(cls.name, cls)
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
