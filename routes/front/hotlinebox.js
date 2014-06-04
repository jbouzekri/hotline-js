var express = require('express');
var globals = require('../../globals');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    res.render('hotlinebox', {
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
