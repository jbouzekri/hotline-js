var express  = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/admin');
}).get('/',
    function(req, res) {
        res.render('back/desktop');
});

module.exports = router;
