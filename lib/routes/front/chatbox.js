var express = require('express');

var router = express.Router();

/* GET hotlinebox */
router.get('/', function(req, res) {
    var template = 'contact';
    if (req.app.get('online_state').online) template = 'chatbox';

    var message = {name:"",email:"",message:""};
    var errors = [];

    res.render('front/'+template, {
        csrf: req.csrfToken(),
        message: message,
        errors: errors,
        bodyClass: "bordered",
        innerHeight: req.app.get('config').get('inner_height'),
        chatHeight: req.app.get('config').get('chat_height')
    });
});

module.exports = router;
