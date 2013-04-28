

var config = require('../../config');
var email  = require("emailjs/email");

var server = email.server.connect({
   user:     config.user, 
   password: config.password, 
   host:     config.host, 
   ssl:      true
});

var message = {
   text:    "i hope this works", 
   from:    "you <asaeed@gmail.com>", 
   to:      "someone <asaeed@gmail.com>, another <asaeed@gmail.com>",
   cc:      "",
   subject: "testing emailjs"
};

server.send(message, function(err, message) { console.log(err || message); });


exports.findByEmail = function(email, callback) {
    console.log('about to send an email...');

	var message = {
	   text:    "i hope this works", 
	   from:    "you <asaeed@gmail.com>", 
	   to:      "someone <asaeed@gmail.com>, another <asaeed@gmail.com>",
	   cc:      "",
	   subject: "testing emailjs"
	};

	server.send(message, function(err, message) { console.log(err || message); });
};