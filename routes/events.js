var Room = require('../models/room');
var Event = require('../models/event');
var User = require('../models/user');
var RoomHandler = require('../utils/roomHandler');
var Utils = require('../utils/utils');

module.exports = function(app){
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
				//!!! remove date check and move to front end
				//if( Date.parse(items[i].date) > yesterday ){//if today or in future
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

				//}
			}
			//sort by date descending
			publicItems.sort(function(a,b){
				// Turn your strings into dates, and then subtract them
				// to get a value that is either negative, positive, or zero.
				return new Date(b.date) - new Date(a.date);
			});

			//!!! remove ascending, save for front end

			//ascending
			//publicItems.reverse();

			res.send(publicItems); //TODO : fork for admin res.send({ events: items }); 
			//res.send("events", { event: items });
		});
	});

	//get event by id
	app.get('/events/:id', function(req, res){
		var id = req.params.id;
   		console.log('Retrieving event id : ' + id,req.params);
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

	//update event by id
	app.put("/events/:id", function (req, res) {
		console.log('update event',req.body.name,req.body.id);
		var id = req.params.id;
		Event.updateEvent( id, req , function(err, updatedEvent){
			if(err) throw err;
			console.log(req.body.name + '\'s updated');
			//res.redirect("/#/profile");
			res.send(updatedEvent);//TODO: actually the old event and not updated one, though updates
		});
	});

	//delete event by id
	app.delete("/events/:id", function (req, res) {
		console.log('delete event',req.params.id);
		var id = req.params.id;
		Event.deleteEvent( id, req , function(err, response){
			if(err) throw err;
			console.log(req.body.name + '\'s deleted');
			res.send(response);
		});
	});


	/**
	 * get events that user has joined
	 */
	app.get("/events/email/:email", function (req, res) {
		var events = [];
		var roomsUserHasJoined = [];
		var eventsUserHasJoined = [];
		var user_id;
		User.findByEmail(req, function (err, user) {
			if (err) return console.error(err);
			user_id = user._id;

			//next
			getEvents();
		});
		function getEvents(){
			//get all events
			Event.find(function (err, items) {
				if (err) return console.error(err);
				for(var i=0;i<items.length;i++){
					events.push(items[i]);
				}
				//next
				getRooms();
			});
		}
		function getRooms(){
			//get rooms user has joing //duplicated code from rooms...:(
			Room.find(function (err, items) {
				if (err) return console.error(err);

				//loop through all rooms
				for(var i=0;i<items.length;i++){
					if(items[i].isEvent){
						//loop through joined users
						for(var j=0;j<items[i].joinedUsers.length;j++){
							if(items[i].joinedUsers[j].joinedUserID == user_id){
								roomsUserHasJoined.push(items[i]);
							}
						}
					}
				}

				//next
				compareEventsAndRooms();
			});			
		}

		function compareEventsAndRooms(){
			//check all events for matching rooms user has joined
			
			for(var j=0;j<roomsUserHasJoined.length;j++){
				for(var i=0;i<events.length;i++){
					console.log(events[i].roomID,roomsUserHasJoined[j]._id)
					if(events[i].roomID == roomsUserHasJoined[j]._id){
						eventsUserHasJoined.push(events[i]);
					}
				}
			}

			//send	
			res.send(Utils.uniqueArray(eventsUserHasJoined))
		}

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