JSON.tryParse = function (string, reviver) {
  try { return JSON.parse(string, reviver) }
  catch { return undefined }
}
