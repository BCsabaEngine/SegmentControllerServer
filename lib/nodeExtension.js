global.isObject = (o) => (!!o) && (o.constructor === Object)

global.getRandomInt = (max) => Math.floor(Math.random() * max)

JSON.tryParse = function (string, reviver) {
  try { return JSON.parse(string, reviver) }
  catch { return null }
}

JSON.empty = {}

global.normalizeRGBColor = (colorstring) => {
  try { return require('color')(colorstring).hex() }
  catch { return null }
}