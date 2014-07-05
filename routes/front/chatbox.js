var express = require('express');
var online_state = require('../../online_state');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    var template = 'contact';
    if (online_state.online) template = 'chatbox';

    var message = {name:"",email:"",message:""};
    var errors = [];

    res.render('front/'+template, {
        csrf: req.csrfToken(),
        message: message,
        errors: errors,
        bodyClass: "bordered",
        scrollHeight: req.app.get('config').get('scrollHeight')
    });
});

module.exports = router;
