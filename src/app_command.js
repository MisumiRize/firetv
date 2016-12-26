const program = require('commander')
const semver = require('semver')

let index
if (semver.gt(process.version, '7.0.0')) {
  index = require('../src/')
} else {
  require('babel-polyfill')
  index = require('../lib/')
}

program
  .version('0.0.1')
  .arguments('<app> <subcommand> [hosts...]')
  .action((action, hosts) => {
    index.app(app, subcommand, hosts)
      .then(() => console.log('done'))
      .catch(err => console.log(err))
  })

program.parse(process.argv)