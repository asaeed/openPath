var mongoose = require('mongoose');
var Room = require('../models/room');

EventSchema = mongoose.Schema({
	creatorID: String,
	roomID : String,
	dateCreated:  { type: Date, default: Date.now },
	dateModified: Date,
	name: String,
	link: String,
	description: String,
	location: {
		name : String,
		longitude : Number,
		latitude : Number,
		reference : String,
		formattedAddress : String
	}, 
	grades: [String],
	date : Date,
	startTime:  String,
	endTime : String
});

EventSchema.statics.addEvent = function(req, done){
	var self = this;
	/**
	 * @description create room and attach id to new event
	 * @param user_id
	 * @param isEvent Boolean
	 */
	Room.createRoom(req.user._id, true, function(err, room){
		if(err) throw err;
		//set room then create event
		createEvent( room );
	});

	function createEvent( room ){
		console.log('ev req = ', req.body);

		self.create({
			creatorID : req.user._id,
			roomID : room._id,
			dateCreated : Date.now(),
			dateModified : Date.now(),
			name: req.body.name,
			link: req.body.link,
			description: req.body.description,
			location : {
				name : req.body.location.name,
				longitude : req.body.location.longitude,
				latitude : req.body.location.latitude,
				reference : req.body.location.reference,
				formattedAddress : req.body.location.formattedAddress
			},
			date : req.body.date,
			startTime:  req.body.startTime,
			endTime : req.body.endTime
			//TODO: grades
		}, function(err, newEvent){
			if(err) throw err;
			// if (err) return done(err);
			done(null, newEvent);
		});
	}
};


/**
 * update
 */
EventSchema.statics.updateEvent = function(id, req, done){
	console.log('eventeventevent',req)
	Event.findOne(id, function(err, item){
		if(err) throw err;

		// If a item is returned, load the given user
		if(item){
			item.update({
				//creatorID : req.user._id,
				//roomID : room._id,
				//dateCreated : Date.now(),
				dateModified : Date.now(),
				name: req.body.name,
				link: req.body.link,
				description: req.body.description,
				location : {
					name : req.body.location.name,
					longitude : req.body.location.longitude,
					latitude : req.body.location.latitude,
					reference : req.body.location.reference,
					formattedAddress : req.body.location.formattedAddress
				},
				date : req.body.date,
				//startTime:  req.body.startTime,
				//endTime : req.body.endTime
			},function(err, numberAffected, raw){
				if (err) return console.error(err);
				console.log('The number of updated documents was %d', numberAffected);
				console.log('The raw response from Mongo was ', raw);
				done(null, item);//TODO shouldn't be passing item back cuz it is old one, need updated item or just a msg - check user profile update for same issue
			});
		} else {
			console.log('There is no event by that id so no event updating happening.');
		}
	});
};




/*
EventSchema.statics.deleteAll = function(req, done) {
	this.remove( function(err, user){
		// if(err) throw err;
		if(err) return done(err);

	});
};
*/


var Event = mongoose.model("Event", EventSchema);
module.exports = Event;