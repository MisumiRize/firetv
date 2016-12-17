const {spawn} = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const rimraf = require('rimraf')

const cwd = path.join(os.tmpdir(), 'ADBKeyBoard')
const apk = path.join(cwd, 'keyboardservice/build/outputs/apk/keyboardservice-debug.apk')

async function build() {
  if (fs.existsSync(cwd)) {
    rimraf.sync(cwd)
  }

  const clone = new Promise((resolve, reject) => {
    const git = spawn('git', ['clone', 'https://github.com/senzhk/ADBKeyBoard.git', cwd])
    git.stdout.on('data', data => console.log(data.toString().trim()))
    git.stderr.on('data', data => console.log(data.toString().trim()))
    git.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject()
      }
    })
  })
  await clone

  const build = new Promise((resolve, reject) => {
    const gradlew = spawn('./gradlew', ['build'], {cwd})
    gradlew.stdout.on('data', data => console.log(data.toString().trim()))
    gradlew.stderr.on('data', data => console.log(data.toString().trim()))
    gradlew.on('close', code => {
      if (code === 0) {
        resolve()
      } else {
        reject()
      }
    })
  })
  await build
}

module.exports = {
  apk,
  build
}