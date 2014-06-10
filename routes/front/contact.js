var express   = require('express');
var validator = require('express-validator');

var globals   = require('../../globals');

var router = express.Router();


/* GET hotlinebox */
router.post('/', function(req, res) {
    var message = req.body.message;

    req.assert(['message', 'name'], 'Please enter your name').len(1, 100);
    req.assert(['message', 'email'], 'Please enter a valid email address').isEmail();
    req.assert(['message', 'message'], 'Please enter a valid message').len(1, 10000);

    var errors = req.validationErrors(true);

    if (errors !== null) {
        res.render('contact', {
            theme: req.app.get('config').get('theme'),
            message: message,
            csrf: req.csrfToken(),
            errors: errors
        });
    } else {
        res.render('contact_success', {
            theme: req.app.get('config').get('theme')
        });
    }
    /**/
});

module.exports = router;
