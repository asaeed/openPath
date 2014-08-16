var Room = require('../models/room');
var Event = require('../models/event');
var User = require('../models/user');
var RoomHandler = require('../utils/roomHandler');
var Utils = require('../utils/utils');

/**
 * rooms 
 */
module.exports = function(app){
	/**
	 * get all rooms
	 */
	app.get("/rooms", function (req, res) {
		//var admin = req.user.email === 'jamiegilmartin@gmail.com' || req.user.email === 'jaredlamenzo@gmail.com';
		//if(!admin) res.redirect("/");
		console.log('get rooms')
		Room.find(function (err, items) {
			if (err) return console.error(err);
			res.send(items);
			//res.render("admin/rooms", { rooms: items });
		});
	});
	//get room by id
	app.get('/room/:id', function(req, res){
		var id = req.params.id;
   		console.log('Retrieving room id : ' + id,req.params);
		Room.findOne({ _id: id }, function (err, item) {
			if (err) return console.error(err);
			res.send(item);
		});
	});
	/**
	 * get rooms that user has joined
	 */
	app.get("/rooms/email/:email", function(req, res){
		var roomsUserHasJoined = [];
		var user_id;
		User.findByEmail(req, function (err, user) {
			if (err) return console.error(err);
			user_id = user._id;
		});

		Room.find(function (err, items) {
			if (err) return console.error(err);
			
			//loop through all rooms
			for(var i=0;i<items.length;i++){

				//loop through joined users
				for(var j=0;j<items[i].joinedUsers.length;j++){
					if(items[i].joinedUsers[j].joinedUserID == user_id){
						roomsUserHasJoined.push(items[i]);
					}
				}
			}

			//send roomsUserHasJoined
			res.send(Utils.uniqueArray(roomsUserHasJoined));
		
		});
	});
};