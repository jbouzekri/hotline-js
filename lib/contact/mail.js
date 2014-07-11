var nodemailer = require("nodemailer");

var ContactProcessor = module.exports = function ContactProcessor(config) {

    var Mailer = function(transport, options) {
        this.smtpTransport = nodemailer.createTransport(transport,options);

        this.processForm = function (req, email, errorCallback) {

            var mailOptions = {
                from: req.body.message.email,
                to: email,
                subject: req.body.message.name,
                text: req.body.message.message
            };

            var transportObject = this.smtpTransport;
            this.smtpTransport.sendMail(mailOptions, function(error){
                if(error){
                    console.log(error);
                    console.log(mailOptions);
                }

                transportObject.close();
            });
        };
    };

    return new Mailer(config.transport, config.options);
};