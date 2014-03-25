var Event = require('../models/event');
var Room = require('../models/room');

/**
 * checkForRoom - both logged in and out
 */
module.exports.checkForRoom = function( req ){
	/**
	 * check for Query
	 */
	if(req.query.e){
		console.log("REC Q E",req.query);

		//set session event
		req.session.event = req.query.e;

		//if user logged join event
		if(req.user) this.joinEvent( req );

	} else if(req.query.r){
		console.log("REC Q R",req.query);

		//set session room
		req.session.room = req.query.r;

		//if user logged in join room
		if(req.user) this.joinRoom( req );

	} else {

		console.log('no room query, no event query');
		
		//if user logged in check for session
		if(req.user) this.checkForSession( req );
	}
};

/**
 * checkForSession - below logged in ONLY
 */
module.exports.checkForSession = function( req ){

	console.log('CH SES', req.session.event, req.session.room, req.user._id)

	if(req.session.event){

		//join the event
		this.joinEvent( req );

	}else if(req.session.room){

		//join the room
		this.joinRoom( req );

	}else{
		//if user make room?

		console.log('no room session, no event session');
		//this.makeNewRoom( req );
	}
};


module.exports.joinEvent = function( req ){
	var self = this;

	Event.findOne({ _id: req.session.event }, function (err, item) {
		if (err) return console.error(err);



		/*
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
		*/
		if(item){
			console.log('join event, room id = ',item.roomID );

			//set session room using events room
			req.session.room = item.roomID;

			//join room
			self.joinRoom( req );


		}else{
			console.log('event doesn\'t exist');
			//check date -> the event you're trying to join is over

		}
		

		


		//self.joinRoom( req );
		//res.send(publicItem);
	});

};

module.exports.makeNewRoom = function( req ){
	//make new room
	Room.createRoom(req.user._id, function(err, room){
		if(err) throw err;
		console.log('room=',room);
	//req.session.room = req.session.email
	});

};

module.exports.joinRoom = function( req ){
	
	Room.joinRoom( req.user._id, req.session.room , function(err, item ){
		if (err) return console.error(err);

		console.log('Joine d User =',item);
	});

	/*
	Room.findOne({ _id: req.session.room }, function (err, item) {
		if (err) return console.error(err);

		console.log('join room, room =',item);

		if(item){


			item.update({firstName: req.body.firstName , lastName: req.body.lastName},function(err, numberAffected, raw){
				if (err) return console.error(err);
				console.log('The number of updated documents was %d', numberAffected);
				console.log('The raw response from Mongo was ', raw);
				done(null, user);
			});


		}else{
			console.log('can\'t join room cuz couldn\'t find it');
		}

		//res.send(publicItem);
	});
	*/
};



