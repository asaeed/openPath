var Event = require('../models/event');
var Room = require('../models/room');

/**
 * checkForRoom - both logged in and out
 */
module.exports.checkForRoom = function( req , done ){
	/**
	 * check Query for Event
	 */
	if(req.query.e){
		console.log("REC Q E",req.query);

		//set session event
		req.session.event = req.query.e;

		//if user logged join event
		if(req.user){
			this.joinEvent( req, done );
		}else{
			done();
		}

	} 
	/**
	 * check Query for Room
	 */
	else if(req.query.r){
		console.log("REC Q R",req.query);

		//set session room
		req.session.room = req.query.r;

		//if user logged in join room
		if(req.user){
			this.joinRoom( req, done );
		}else{
			done();
		}

	}
	/**
	 * check if sessions set (if logged in)
	 */
	else {

		//if user logged in check for already set session
		if(req.user){
			/**
			 * check Sessions for event
			 */
			if(req.session.event){

				//join the event
				this.joinEvent( req , done );

			}
			/**
			 * check Sessions for room
			 */
			else if(req.session.room){

				//join the room
				this.joinRoom( req , done );

			}
			/**
			 * no room, no event, make room
			 */
			else{
				console.log('no room session, no event session, making room');
				this.makeNewRoom( req , done );
			}
		}else{
			//no user, send nothing
			done();
		}
	}
};


module.exports.joinEvent = function( req, done ){
	var self = this;

	Event.findOne({ _id: req.session.event }, function (err, item) {
		if (err) return console.error(err);

		//TODO check date -> the event you're trying to join is over

		if(item){
			console.log('join event, room id = ',item.roomID );

			//set session room using events room
			req.session.room = item.roomID;

			//join room
			self.joinRoom( req , function( placeholder, room ){
				done( item, room );
			});


		}else{
			console.log('event doesn\'t exist');
			

		}
	});

};

module.exports.makeNewRoom = function( req, done ){
	var self = this;
	//make new room
	Room.createRoom(req.user._id, false, function(err, item){
		if(err) throw err;
		console.log('makeNewRoom=',item);
		//set session room using events room
		req.session.room = item._id;

		//join room
		self.joinRoom( req , function( placeholder, room ){
			done( null, room );
		});
	});

};

module.exports.joinRoom = function( req, done ){
	
	Room.joinRoom( req.user._id, req.session.room , function( err, item ){
		if (err) return console.error(err);

		console.log('Joine d User =',item);

		//either pass null to 'done' from routes since there is no event
		//or pass null to 'done' from this.joinEvent which disregards it and fills in own event
		//or pass null to 'done' from this.makeNewRoom which disregards it and fills in own null
		done(null, item);
	});

};



