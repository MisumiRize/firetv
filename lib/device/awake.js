const adb = require('adb')
const client = require('../adb_client')

function awake(promise) {
  return promise.then(id => {
    return client.shell(id, 'dumpsys power')
      .then(adbkit.util.readAll)
      .then(lines => {
        const displayPower = lines.toString().split('\n')
          .find(line => line.indexOf('Display Power') === 0)

        if (!displayPower) {
          return Promise.reject('Display Power not found')
        }

        if (displayPower.indexOf('ON') !== -1) {
          return Promise.resolve(id)
        }

        return client.shell(id, 'input keyevent POWER')
          .then(() => Promise.resolve(id))
      })
      .then(id => {
        return client.shell(id, 'input keyevent HOME')
          .then(() => Promise.resolve(id))
      })
  })
}

module.exports = awake