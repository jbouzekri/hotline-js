var express  = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/admin');
}).get('/',
    function(req, res) {
        var onlineState = req.app.get('online_state');

        res.render('back/desktop', {
            online: onlineState.online,
            onlineDate: onlineState.startDate,
            debug: req.app.get('config').get('debug')
        });
});

module.exports = router;
