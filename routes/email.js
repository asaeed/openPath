

var config = require('../../config');
var email  = require("emailjs/email");

var server = email.server.connect({
   user:     config.email.user, 
   password: config.email.password, 
   host:     config.email.host, 
   ssl:      true
});

console.log(config.email.user);
console.log(config.email.password);
console.log(config.email.host);

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