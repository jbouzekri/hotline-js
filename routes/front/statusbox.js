var express     = require('express');
var onlineState = require('../../online_state.js');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    res.render('front/statusbox', {
        host: req.app.get('config').get('host'),
        online: onlineState.online,
        bodyClass: "colored"
    });
});

module.exports = router;
