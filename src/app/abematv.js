const actions = require('../actions')
const {client, delay} = require('../adb_client')

function start(options) {
  return async function(id) {
    await actions.awake(id)
    await client.startActivity(id, {
      wait: true,
      component: 'tv.abema/.components.activity.LauncherActivity'
    })
  }
}

module.exports = {
  start
}