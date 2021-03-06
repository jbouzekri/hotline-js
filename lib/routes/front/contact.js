var express   = require('express');
var validator = require('express-validator');

var router = express.Router();


/* GET hotlinebox */
router.post('/', function(req, res) {
    var message = req.body.message;

    req.assert(['message', 'name'], 'Please enter your name').len(1, 100);
    req.assert(['message', 'email'], 'Please enter a valid email address').isEmail();
    req.assert(['message', 'message'], 'Please enter a valid message').len(1, 10000);

    var errors = req.validationErrors(true);

    if (errors !== null) {
        res.render('front/contact', {
            message: message,
            csrf: req.csrfToken(),
            errors: errors,
            bodyClass: "bordered",
            innerHeight: req.app.get('config').get('inner_height')
        });
    } else {
        var contactProcessorClass = require(req.app.get('config').get('contact').processor);
        var contactProcessor = contactProcessorClass(req.app.get('config').get('contact').arguments);

        contactProcessor.processForm(req, req.app.get('config').get('email'));

        res.render('front/contact_success', {
            innerHeight: req.app.get('config').get('inner_height'),
            bodyClass: "bordered"
        });
    }
    /**/
});

module.exports = router;
