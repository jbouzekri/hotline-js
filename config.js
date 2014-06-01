module.exports = function (environment) {
    var fs      = require('fs'),
        nconf   = require('nconf');

    nconf.argv()
         .env()
         .file('override', './config/config_'+environment+'.json')
         .file('default', './config/config.json');

    nconf.set('base_dir', __dirname);
    nconf.set('env', environment);

    return nconf;
};
