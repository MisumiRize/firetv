const EvilScan = require('evilscan')
const ip = require('ip')
const os = require('os')

const client = ('./adb_client')

function findHosts(port = '5555') {
  const scanSubnets = Object.values(os.networkInterfaces())
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
          .on('done', () => resolve(hosts))
          .run()
      })
    })

  return Promise.all(scanSubnets)
    .then(subnets => {
      const getFeatures = subnets
        .reduce((previous, current) => previous.concat(current), [])
        .map(host => {
          return client.connect(host.ip)
            .then(id => {
              return client.getFeatures(id)
                .then(features => Promise.resolve({id, features}))
            })
        })

      return Promise.all(getFeatures)
    })
    .then(hosts => {
      return hosts
        .filter(host => host.features['amazon.hardware.fire_tv'])
        .map(host => host.id)
    })
}

module.exports = findHosts