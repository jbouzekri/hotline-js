var express  = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/admin');
}).get('/',
    //passport.authenticate('local'),
    function(req, res) {
        res.send('Desktop');
});

module.exports = router;
