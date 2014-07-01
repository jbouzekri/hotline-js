var express  = require('express');
var passport = require('passport');
var online_state = require('../../online_state');

var router = express.Router();

/* GET home page. */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/admin');
}).get('/',
    function(req, res) {
        res.render('back/desktop', {
            online: online_state.online,
            onlineDate: online_state.startDate,
            debug: req.app.get('config').get('debug')
        });
});

module.exports = router;
