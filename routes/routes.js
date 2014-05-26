var User = require('../models/user');
var Room = require('../models/room');
var Event = require('../models/event');
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
				/*
				var safeUser = {
					firstName : req.user.firstName,
					lastName : req.user.lastName,
					email : req.user.email
					//TODO rest of modal
				}
				*/

				//res.render("home", { user : safeUser,  event : event, room : room });
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
	 * users 
	 */
	app.get("/users", function (req, res) {
		var admin = req.user.email === 'jamiegilmartin@gmail.com' || req.user.email === 'jaredlamenzo@gmail.com';
		if(!admin) res.redirect("/");

		User.find(function (err, items) {
			if (err) return console.error(err);
			//res.send(items);
			res.render("admin/users", { user: items });
		});
	});

	//get user by email
	app.get("/user/:email", function (req, res) {
		User.findByEmail(req, function (err, user) {
			if (err) return console.error(err);

		// If a user is returned, load the given user
			console.log('user is',user);
			var publicUser = {
				firstName:  user.firstName,
				lastName:   user.lastName,
				email:      user.email,
				//salt:       String,
				//hash:       String,
				//facebook:{
				//	id:       String,
				//	email:    String,
				//	name:     String
				//},
				//google:{
				//	id:       String,
				//	email:    String,
				//	name:     String
				//},
				//dateCreated:  Date,
				//dateModified: Date,
				gradeLevel : user.gradeLevel,
				interests : user.interests,
				coLearners : user.coLearners
			}
			res.send(publicUser);
		});
	});

	//profile post
	app.post("/profile", Auth.userExist, function(req, res, next){
		console.log('update profile',req.user._id,req.body.firstName,req.body.lastName);
		User.updateProfile(req , function(err,user){
			if(err) throw err;
			console.log(user.email + '\'s profile updated');
			res.redirect("/#/profile");
		});
	});

	/**
	 * check if presenter 
	 */
	app.get('/presenter/:id/:email', function(req, res){
		var id = req.params.id;
		var email = req.params.email;
   		console.log('Retrieving presenter : ' + id+' '+email);
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

	/**
	 * rooms 
	 */
	app.get("/rooms", function (req, res) {
		var admin = req.user.email === 'jamiegilmartin@gmail.com' || req.user.email === 'jaredlamenzo@gmail.com';
		//if(!admin) res.redirect("/");

		Room.find(function (err, items) {
			if (err) return console.error(err);
			//res.send(items);
			res.render("admin/rooms", { rooms: items });
		});
	});




	/**
	 * events 
	 */
	app.get("/events", function (req, res) {
		Event.find(function (err, items) {
			if (err) return console.error(err);

			var publicItems = [];
			for(var i=0;i<items.length;i++){

				var today = new Date();
				var yesterday = today.setDate(today.getDate() - 1);

				console.log('date',yesterday,today)

				if( Date.parse(items[i].date) > yesterday ){//if today or in future
					var mine = req.user ? ( items[i].creatorID == req.user._id ) : false;
					var publicItem = {
						id          : items[i]._id,
						room        : items[i].roomID,
						name        : items[i].name,
						link        : items[i].link,
						description : items[i].description,
						date        : Utils.formatDate( items[i].date ),
						startTime   : Utils.formatTime( items[i].startTime ),
						endTime     : Utils.formatTime( items[i].endTime ),
						location    : items[i].location,
						isMine      : mine ? true : false
					};
					

					publicItems.push( publicItem );

				}
			}
			//sort by date descending
			publicItems.sort(function(a,b){
				// Turn your strings into dates, and then subtract them
				// to get a value that is either negative, positive, or zero.
				return new Date(b.date) - new Date(a.date);
			});
			//ascending
			publicItems.reverse();

			res.send({ events: publicItems }); //TODO : fork for admin res.send({ events: items }); 
			//res.send("events", { event: items });
		});
	});

	//get event by id
	app.get('/events/:id', function(req, res){
		var id = req.params.id;
   		console.log('Retrieving event id : ' + id);
		Event.findOne({ _id: id }, function (err, item) {
			if (err) return console.error(err);
			var publicItem = {
				id          : item._id,
				room        : item.roomID,
				name        : item.name,
				link        : item.link,
				description : item.description,
				date        : Utils.formatDate( item.date ),
				startTime   : Utils.formatTime( item.startTime ),
				endTime     : Utils.formatTime( item.endTime ),
				location    : item.location
			};


			res.send(publicItem);
		});
	});

	//add event, events post
	app.post("/events", function (req, res) {
		Event.addEvent(req, function(err, newEvent){
			if(err) throw err;
			console.log('newEvent=',newEvent);
			//res.redirect("/#/events");
			res.send(newEvent);
		});
	});

	/**
	 * go to event
	 */
	app.post("/gotoevent/", function (req, res) {

		console.log('gotoevent',req.query)
		RoomHandler.checkForRoom( req , function( event, room ){
			res.send({
				room : room,
				event : event
			});
		});
	});
};