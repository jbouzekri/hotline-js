var _ = require('underscore');

module.exports = function (config) {
    return function (req, res, next) {

        var origin = req.headers.origin;
        if (!_.contains(config.get('allowed_origins'), origin) && config.get('allowed_origins') != '*') {
            return next();
        }

        res.setHeader('Access-Control-Allow-Origin', origin);

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    };
};
