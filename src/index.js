const apps = require('./app/')
const actions = require('./actions')
const keyboard = require('./adb_keyboard')
const findHosts = require('./find_hosts')

async function action(actionName, hosts) {
  const ids = await findHosts()
  if (action === 'init') {
    await keyboard.build()
  }
  await Promise.all(ids.map(actions[actionName]))
}

async function app(appName, subcommand, options) {
  const ids = await findHosts()
  const command = apps[appName][subcommand]
  console.log(subcommand)
  console.log(apps[appName])
  await Promise.all(ids.map(command(options)))
}

module.exports = {
  action,
  app
}