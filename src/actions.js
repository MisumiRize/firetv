const adb = require('adbkit')

const {client, delay} = require('./adb_client')
const keyboard = require('./adb_keyboard')

async function init(id) {
  await client.install(id, keyboard.apk)
  const stream = await client.shell(id, 'ime set com.android.adbkeyboard/.AdbIME')
  const body = await adb.util.readAll(stream)
  if (body.indexOf('selected') === -1) {
    throw new Error('AdbIME select failed')
  }
}

function ensurePower(status) {
  return async function(id) {
    const stream = await client.shell(id, 'dumpsys power')
    const lines = await adb.util.readAll(stream)
    const displayPower = lines.toString()
      .split('\n')
      .find(line => line.indexOf('Display Power') === 0)

    if (!displayPower) {
      throw new Error('Display Power not found')
    }

    if (displayPower.indexOf(status) !== -1) {
      return
    }

    await client.shell(id, 'input keyevent POWER')
  }
}

const awake = ensurePower('ON')

async function home(id) {
  await awake(id)
  await client.shell(id, 'input keyevent HOME')
}

async function play(id) {
  await client.shell(id, 'input keyevent MEDIA_PLAY')
}

async function pause(id) {
  await client.shell(id, 'input keyevent MEDIA_PAUSE')
}

module.exports = {
  awake,
  asleep: ensurePower('OFF'),
  home,
  init,
  play,
  pause,
}