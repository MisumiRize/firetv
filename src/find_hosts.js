const EvilScan = require('evilscan')
const ip = require('ip')
const os = require('os')

const {client} = require('./adb_client')

function scanSubnets(port) {
  return Object.values(os.networkInterfaces())
    .reduce((previous, current) => previous.concat(current), [])
    .filter(iface => iface.family === 'IPv4' && !iface.internal)
    .map(iface => ip.subnet(iface.address, iface.netmask))
    .map(subnet => {
      return new Promise((resolve, reject) => {
        const scanner = new EvilScan({
          target: `${subnet.firstAddress}/${subnet.subnetMaskLength}`,
          port,
          status: 'O'
        })

        const hosts = []

        scanner.on('result', data => {
          if (data.status === 'open') {
            hosts.push(data)
          }
        })
          .on('error', err => reject(err))
          .on('done', () => resolve(hosts))
          .run()
      })
    })
}

async function getFeatures(host) {
  const id = await client.connect(host.ip)
  const features = await client.getFeatures(id)
  return {id, features}
}

async function findHosts(port = '5555') {
  const subnets = await Promise.all(scanSubnets(port))
  const hosts = await Promise.all(
    subnets
      .reduce((previous, current) => previous.concat(current), [])
      .map(host => getFeatures(host))
  )
  return hosts
    .filter(host => host.features['amazon.hardware.fire_tv'])
    .map(host => host.id)
}

module.exports = findHosts