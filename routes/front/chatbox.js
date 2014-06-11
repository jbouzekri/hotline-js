var express = require('express');
var globals = require('../../globals');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    var template = 'contact';
    if (globals.online) template = 'chatbox';

    var message = {name:"",email:"",message:""};
    var errors = [];

    res.render('front/'+template, {
        csrf: req.csrfToken(),
        message: message,
        errors: errors
    });
});

module.exports = router;
