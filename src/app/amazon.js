const actions = require('../actions')
const {client, delay} = require('../adb_client')

function search(options) {
  return async function(id) {
    await actions.home(id)
    await delay(1000)
    await client.shell(id, 'input keyevent SEARCH')
    await delay(1000)
    await client.shell(id, `am broadcast -a ADB_INPUT_TEXT --es msg "${options[0]}"`)
  }
}

module.exports = {
  search
}