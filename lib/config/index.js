var nconf = require('nconf');
nconf.file({ file: __dirname + '/config.json' });
module.exports = nconf;