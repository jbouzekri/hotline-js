var express     = require('express');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    res.render('front/statusbox', {
        host: req.app.get('config').get('host'),
        online: req.app.get('online_state').online,
        bodyClass: "colored"
    });
});

module.exports = router;
