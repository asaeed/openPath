var mongoose = require('mongoose');

InterestSchema = mongoose.Schema({
	creatorID: String,
	dateCreated:  { type: Date, default: Date.now },
	dateModified: Date,
	value: String
});

//todo findInterest

//todo
InterestSchema.statics.createInterest = function(creatorID, value, done){
	this.create({
		creatorID : creatorID,
		dateCreated : Date.now(),
		dateModified : Date.now(),
		value : value
	}, function(err, room){
		if(err) throw err;
		// if (err) return done(err);
		done(null, room);
	});
};


var Interest = mongoose.model("Interest", InterestSchema);
module.exports = Interest;