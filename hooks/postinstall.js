var fs = require('fs');
var path = require('path');
var semver = require('semver');

var COMMAND = path.join(__dirname, '../lib/command.js');

if (!fs.existsSync(COMMAND)) {
  process.exit(0);
}

var to = fs.createWriteStream(
    path.join(__dirname, '../bin/firetv'),
    {mode: 0o755}
  )
  .on('error', function(err) {
    console.error(err);
    process.exit(1);
  });

if (semver.gt(process.version, '7.0.0')) {
  to.write('#!/usr/bin/env node --harmony-async-await');
} else {
  to.write('#!/usr/bin/env node');
}

to.write('\n\n');

fs.createReadStream(COMMAND)
  .on('error', function(err) {
    console.error(err);
    process.exit(1);
  })
  .pipe(to);