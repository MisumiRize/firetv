const actions = require('./actions')
const keyboard = require('./adb_keyboard')
const findHosts = require('./find_hosts')

async function index(action, hosts) {
  const ids = await findHosts()
  if (action === 'init') {
    await keyboard.build()
  }
  return await Promise.all(ids.map(actions[action]))
}

module.exports = index