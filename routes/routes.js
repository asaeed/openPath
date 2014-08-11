var User = require('../models/user');
var Room = require('../models/room');
//var Event = require('../models/event');
var Interest = require('../models/interest');
var Auth = require('../utils/auth');
var Utils = require('../utils/utils');
var RoomHandler = require('../utils/roomHandler');
var SocketHandler = require('../utils/socketHandler');
var EmailConfig = require('../../config');
var Email  = require("emailjs/email");

/**
 * routes 
 */
module.exports = function(app, io, passport){
	
	//start socket
	SocketHandler.start( io );

	/**
	 * home
	 */
	app.get("/", function(req, res){
	
		if(req.isAuthenticated()){
			//logged in
			//check for query string & sessions
			RoomHandler.checkForRoom( req , function( event, room ){
				//console.log('DONE CHECKING FOR ROOM',req.user);
				res.render("home", { user_email : req.user.email });
			});

			

		}else{
			//logged out, render intro
			//check for query string & sessions
			RoomHandler.checkForRoom( req , function(){
				res.render("intro");
			});
		}
	});

	/**
	 * login
	 */
	app.get("/login", function(req, res){ 
		res.render("login");
	});
	app.post("/login",
		passport.authenticate('local',{
			successRedirect : "/",
			failureRedirect : "/login",
		})
	);
	/**
	 * signup
	 */
	app.get("/signup", function (req, res) {
		res.render("signup");
	});
	app.post("/signup", Auth.userExist, function (req, res, next) {
		User.signup(req.body.email, req.body.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				return res.redirect("/#/edit-profile");
			});
		});
	});

	/**
	 * logout
	 */
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	/**
	 * email
	 */
	var emailServer = Email.server.connect({
		user:     EmailConfig.email.user, 
		password: EmailConfig.email.password, 
		host:     EmailConfig.email.host, 
		ssl:      true
	});
	app.post('/email', function(req, res){
		console.log('about to send an email...');

		var message = {
			text : req.body.inviteMsg,
			from : "openPath <openpathme@gmail.com>", 
			to : req.body.to,
			cc : "",
			subject : req.body.subject
		}
		emailServer.send(message, function(err, message) { 
			console.log(err || message); 
			//res.send(err || message);
			if(message){
				res.redirect('/#/invited');
			}else{
				res.redirect('/#/error');
			}
		});
	});



	/**
	 * interests
	 */
	app.get("/interests", function(req, res, next){
		//todo
	});
	app.post("/interests", Auth.userExist, function(req, res, next){
		//todo
	});

	/**
	 * check if presenter 
	 */
	app.get('/presenter/:id/:email', function(req, res){
		var id = req.params.id;
		var email = req.params.email;
   		console.log('checking if presenter : ' + id+' '+email);
		Room.findOne({ _id: id }, function (err, room) {
			if (err) return console.error(err);

			//check users for room creator
			User.findOne({ _id: room.creatorID }, function (err, user) {
				if (err) return console.error(err);

				if(user.email == email){
					res.send(true);
				}else{
					res.send(false);
				}
			});
		});
	});


};