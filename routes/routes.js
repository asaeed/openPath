var User = require('../models/user');
var Room = require('../models/room');
var Event = require('../models/event');
var Auth = require('../utils/auth');


/**
 * routes 
 */
module.exports = function(app, io, passport){

	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
			res.render("home", { user : req.user });

			Room.makeRoom(req.user._id, function(err, room){
				if(err) throw err;
				console.log('room=',room);
			});
			/**
			 * socket.io
			 */
			io.sockets.on('connection', function (socket) {
				socket.emit('userConnected', { user: req.user }); //? just emit
				console.log("We have a new client: " + socket.id);
		
				socket.on('peer_id', function(data) {
					console.log("Received: 'peer_id' " + data);

					// We can save this in the socket object if we like
					socket.peer_id = data;
					console.log("Saved: " + socket.peer_id);

					// We can loop through these if we like
					for (var i  = 0; i < io.sockets.clients().length; i++) {
						console.log("loop: " + i + " " + io.sockets.clients()[i].peer_id);
					}
					
					// Tell everyone my peer_id
					socket.broadcast.emit('peer_id',data);
				});
				
				
				socket.on('disconnect', function() {
					console.log("Client has disconnected");
				});
			});
			//TODO move
			

		}else{
			res.render("home", { user : null });
		}
	});

	/**
	 * login, signup, logout
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

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});


	/**
	 * users 
	 * TODO: check if admin user
	 */
	app.get("/users", function (req, res) {
		User.find(function (err, items) {
			if (err) return console.error(err);
			//res.send(items);
			res.render("admin/users", { user: items });
		});
	});
	//profile
	app.post("/profile", Auth.userExist, function(req, res, next){
		console.log('update profile',req.user._id,req.body.firstName,req.body.lastName);
		User.updateProfile(req , function(err,user){
			if(err) throw err;
			console.log(user.email + '\'s profile updated');
			res.redirect("/#/profile");
		});
	});




	/**
	 * rooms 
	 * TODO: check if admin user
	 */
	app.get("/rooms", function (req, res) {
		Room.find(function (err, items) {
			if (err) return console.error(err);
			//res.send(items);
			res.render("admin/rooms", { user: items });
		});
	});

	/**
	 * events 
	 * TODO: check if admin user
	 */
	app.get("/events", function (req, res) {
		Event.find(function (err, items) {
			if (err) return console.error(err);
			res.send(items);
			//res.render("events", { event: items });
		});
	});

	app.post("/events", function (req, res) {
		Event.addEvent(req, function(err, newEvent){
			if(err) throw err;
			console.log('newEvent=',newEvent);
			res.redirect("/#/events");
		});
	});

};