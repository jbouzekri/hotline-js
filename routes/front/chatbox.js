var express = require('express');
var globals = require('../../globals');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    template = 'contact';
    if (globals.online) template = 'chatbox';

    res.render(template, {
        host: req.app.get('config').get('host'),
        theme: req.app.get('config').get('theme'),
        csrf: req.csrfToken(),
        message: {
            "name":"",
            "email":"",
            "message":""
        }
    });
});

module.exports = router;
