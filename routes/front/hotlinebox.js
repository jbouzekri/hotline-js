var express = require('express');
var router = express.Router();

var globals = require('../../globals');

/* GET home page. */
router.get('/', function(req, res) {
    res.send('Hotline Box : '+globals.online);
});

module.exports = router;