var Room = require('../models/room');
var Event = require('../models/event');
var RoomHandler = require('../utils/roomHandler');
var Utils = require('../utils/utils');

/**
 * rooms 
 */
module.exports = function(app){

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
};