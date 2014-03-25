var mongoose = require('mongoose');

//animalSchema.set('autoIndex', false); //preformance

JoinedUserSchema = mongoose.Schema({
	creatorID: String,
	dateJoined:  { type: Date, default: Date.now },
	dateLeft: Date
});
var JoinedUser = mongoose.model("JoinedUser", JoinedUserSchema);

RoomSchema = mongoose.Schema({
	creatorID: String,
	dateCreated:  { type: Date, default: Date.now },
	dateModified: Date,
	isEvent : Boolean,
	joinedUsers : [JoinedUserSchema]

});

RoomSchema.statics.joinRoom = function(creatorID, roomID, done){
	var self = this;

	JoinedUser.create({
		creatorID : creatorID,
		dateJoined : Date.now()
	}, function(err, joinedUser ){
		if(err) throw err;
		// if (err) return done(err);
		//done(null, item );


		self.findOne({ _id: roomID }, function (err, room) {
			if (err) return console.error(err);

			if(room){
				var usersInRoom = room.joinedUsers;
				usersInRoom.push(joinedUser);

				room.update({dateModified: Date.now(), joinedUsers : usersInRoom} ,function(err, numberAffected, raw){
					if (err) return console.error(err);
					console.log('The number of updated documents was %d', numberAffected);
					console.log('The raw response from Mongo was ', raw);
					done(null, room);
				});

			}else{
				console.log('can\'t join room cuz couldn\'t find it');
			}

		});


	});

};



RoomSchema.statics.createRoom = function(creatorID, isEvent, done){

	this.create({
		creatorID : creatorID,
		dateCreated : Date.now(),
		dateModified : Date.now(),
		isEvent : isEvent
	}, function(err, room){
		if(err) throw err;
		// if (err) return done(err);
		done(null, room);
	});
	
};


var Room = mongoose.model("Room", RoomSchema);
module.exports = Room;