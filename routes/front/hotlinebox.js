var express = require('express');
var router = express.Router();

var globals = require('../../globals');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('hotlinebox', {
        host: req.app.get('config').get('host')
    });
});

module.exports = router;
