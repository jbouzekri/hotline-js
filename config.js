var fs      = require('fs'),
    nconf   = require('nconf');

var env = process.env.NODE_ENV || 'prod';

nconf.argv()
     .env()
     .file('override', './config/config_'+env+'.json')
     .file('default', './config/config.json');

module.exports = nconf;