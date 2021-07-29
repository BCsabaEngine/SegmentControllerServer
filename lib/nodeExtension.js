global.isObject = function (o) { return (!!o) && (o.constructor === Object) }

JSON.tryParse = function (string, reviver) {
  try { return JSON.parse(string, reviver) }
  catch { return {} }
}
