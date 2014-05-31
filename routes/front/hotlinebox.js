var express = require('express');
var router = express.Router();

var globals = require('../../globals');

/* GET home page. */
router.get('/', function(req, res) {
    console.log(req.app.get('config').get('name'));
    res.send('Hotline Box : '+globals.online);
});

module.exports = router;
