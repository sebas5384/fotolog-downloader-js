var username = process.argv[2] || null;

if (username == null) {
  console.error('> Username must be enter: node bin/download.js _crazyman');
  return false;
}

require('babel-register')({
  'presets': ['es2015']
});

var download = require('../index.js').default;

download(username);