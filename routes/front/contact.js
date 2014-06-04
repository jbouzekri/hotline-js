var express   = require('express');
var validator = require('validator');
var globals   = require('../../globals');

var router = express.Router();

function validate(message) {
    var errors = [];

    validator.error = function(msg) {
        errors.push(msg);
    };

    validator.check(message.name, 'Please enter your name').len(1, 100);
    validator.check(message.email, 'Please enter a valid email address').isEmail();
    validator.check(message.message, 'Please enter a valid message').len(1, 1000);

    return errors;
}

/* GET hotlinebox */
router.post('/', function(req, res) {
    var message = req.body.message;
    console.log(message);
    /*res.render('hotlinebox', {
        host: req.app.get('config').get('host'),
        theme: req.app.get('config').get('theme'),
        csrf: req.csrfToken(),
        message: {"name":"","email":"","message":""}
    });*/
});

module.exports = router;
