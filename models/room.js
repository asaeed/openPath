var mongoose = require('mongoose');


RoomSchema = mongoose.Schema({
	creatorID: String,
	dateCreated:  { type: Date, default: Date.now() },
	dateModified: Date
});

RoomSchema.statics.makeRoom = function(creatorID, done){
	var User = this;

	this.create({
		creatorID : creatorID,
		dateCreated : Date.now(),
		dateModified : Date.now()
	}, function(err, room){
		if(err) throw err;
		// if (err) return done(err);
		done(null, room);
	});
	
}


var Room = mongoose.model("Room", RoomSchema);
module.exports = Room;