var express  = require('express');
var passport = require('passport');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res){
    res.render('back/login', {
        user: req.user,
        csrf: req.csrfToken(),
        message: req.flash('error')
    });
}).post('/',
    passport.authenticate('local', { failureRedirect: '/admin/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/admin');
    }
);

module.exports = router;
