var express = require('express');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    res.render('statusbox', {
        host: req.app.get('config').get('host'),
        theme: req.app.get('config').get('theme')
    });
});

module.exports = router;
