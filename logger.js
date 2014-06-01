module.exports = function (config) {
    var winston = require('winston');

    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({ level: config.get('console_log_level') }),
            new (winston.transports.File)({
                filename: 'logs/'+config.get('env')+'.log',
                level: config.get('file_log_level')
            })
        ]
    });

    return logger;
};
