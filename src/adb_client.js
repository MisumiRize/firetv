const adb = require('adbkit')

const client = adb.createClient()

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  client,
  delay
}