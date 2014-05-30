var express = require('express');
var router = express.Router();

var globals = require('../../globals');

/* GET home page. */
router.get('/', function(req, res) {
    globals.online = !globals.online;
    res.send('Switch online');
});

module.exports = router;
