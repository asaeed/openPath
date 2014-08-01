var mongoose = require('mongoose');

InterestSchema = mongoose.Schema({
	creatorID: String,
	dateCreated:  { type: Date, default: Date.now },
	dateModified: Date,
	value: String
});


var Interest = mongoose.model("Interest", InterestSchema);
module.exports = Interest;