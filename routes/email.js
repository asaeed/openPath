

var config = require('../../config');
var email  = require("emailjs/email");

var server = email.server.connect({
   user:     config.email.user, 
   password: config.email.password, 
   host:     config.email.host, 
   ssl:      true
});

exports.sendEmailRequest = function(req, res) {
    var email = req.body;
    exports.sendEmail(email.to, email.subject, email.text, function (err, message) {
    	res.send(err || message);
    });
};

exports.sendEmail = function(emailTo, emailSubject, emailBody, callback) {
    console.log('about to send an email...');

	var message = {
	   text:    emailBody, 
	   from:    "openPath <openpathme@gmail.com>", 
	   to:      emailTo,
	   cc:      "",
	   subject: emailSubject
	};

	server.send(message, function(err, message) { 
		console.log(err || message); 
		typeof callback == "function" && callback(err, message);
	});
};