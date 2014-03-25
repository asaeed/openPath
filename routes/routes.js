var User = require('../models/user');
var Room = require('../models/room');
var Event = require('../models/event');
var Auth = require('../utils/auth');


/**
 * routes 
 */
module.exports = function(app, io, passport){

	function roomHandler(req){
		if(req.query.e){
			console.log("REC Q E",req.query)
			//find event
			req.session.event =  req.query.e;

		} else if(req.query.r){
			console.log("REC Q R",req.query)
			//find room
			req.session.room = req.query.r;
		}else {
			/*
			//make new room
			Room.makeRoom(req.user._id, function(err, room){
				if(err) throw err;
				console.log('room=',room);
			//req.session.room = req.session.email
			});
			*/

			console.log('no room, no event')
		}
	}
	/**
	 * home
	 */
	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
			res.render("home", { user : req.user });
			//req.session.email = req.user.email;
			console.log("REC SESS",req.session)
			
			
			//roomHandler(req);
						/*

			Event.findOne({ _id: req.query.e }, function (err, item) {
				if (err) return console.error(err);
				var publicItem = {
					id          : item._id,
					name        : item.name,
					link        : item.link,
					description : item.description,
					date        : formatDate( item.date ),
					startTime   : formatTime( item.startTime ),
					endTime     : formatTime( item.endTime ),
					location    : item.location
				};


				res.send(publicItem);
			});
			*/

			
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
			roomHandler(req);

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
	 * rooms 
	 * TODO: check if admin user
	 */
	app.get("/rooms", function (req, res) {
		Room.find(function (err, items) {
			if (err) return console.error(err);
			//res.send(items);
			res.render("admin/rooms", { rooms: items });
		});
	});



	/** TODO move somewhere nice **/
	//date helper
	function formatDate( dateString ){
		var d = dateString ;

		return d.getMonth() +'/'+ d.getDate() +'/'+d.getFullYear();
	}
	function formatTime( timeString ){
		var t = timeString ;
		var hour = (t.split(':')[0] % 12) == 0 ? 12 : t.split(':')[0] % 12;
		var mins = t.split(':')[1];
		var meridiem = t.split(':')[0] > 11 ? 'PM' : 'AM'; 
		
		return hour + ':' + mins + ' '+meridiem;
	}

	/**
	 * events 
	 * TODO: check if admin user
	 */
	app.get("/events", function (req, res) {
		Event.find(function (err, items) {
			if (err) return console.error(err);

			var publicItems = [];
			for(var i=0;i<items.length;i++){

				var today = new Date();
				var yesterday = today.setDate(today.getDate() - 1);

				if( Date.parse(items[i].date) > yesterday ){//if today or in future
	
					var publicItem = {
						id          : items[i]._id,
						name        : items[i].name,
						link        : items[i].link,
						description : items[i].description,
						date        : formatDate( items[i].date ),
						startTime   : formatTime( items[i].startTime ),
						endTime     : formatTime( items[i].endTime ),
						location    : items[i].location,
						isMine      : ( items[i].creatorID == req.user._id ) ? true : false
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
			//res.render("events", { event: items });
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
				name        : item.name,
				link        : item.link,
				description : item.description,
				date        : formatDate( item.date ),
				startTime   : formatTime( item.startTime ),
				endTime     : formatTime( item.endTime ),
				location    : item.location
			};


			res.send(publicItem);
		});
	});




	//events post
	app.post("/events", function (req, res) {
		Event.addEvent(req, function(err, newEvent){
			if(err) throw err;
			console.log('newEvent=',newEvent);
			res.redirect("/#/events");
		});
	});

};