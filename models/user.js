var mongoose = require('mongoose');
var hash = require('../utils/hash');


UserSchema = mongoose.Schema({
	firstName:  String,
	lastName:   String,
	email:      String,
	salt:       String,
	hash:       String,
	facebook:{
		id:       String,
		email:    String,
		name:     String
	},
	google:{
		id:       String,
		email:    String,
		name:     String
	},
	dateCreated:  Date,
	dateModified: Date
});


UserSchema.statics.signup = function(email, password, done){
	var User = this;
	hash(password, function(err, salt, hash){
		if(err) throw err;
		// if (err) return done(err);
		User.create({
			email : email,
			salt : salt,
			hash : hash,
			dateCreated : Date.now(),
			dateModified : Date.now()
		}, function(err, user){
			if(err) throw err;
			// if (err) return done(err);
			done(null, user);
		});
	});
};


UserSchema.statics.isValidUserPassword = function(email, password, done) {
	this.findOne({email : email}, function(err, user){
		// if(err) throw err;
		if(err) return done(err);
		if(!user) return done(null, false, { message : 'Incorrect email.' });
		hash(password, user.salt, function(err, hash){
			if(err) return done(err);
			if(hash == user.hash) return done(null, user);
			done(null, false, {
				message : 'Incorrect password'
			});
		});
	});
};

/**
 * @deprecated from tutorial
 */
// Create a new user given a profile
UserSchema.statics.findOrCreateOAuthUser = function(profile, done){
	var User = this;

	// Build dynamic key query
	var query = {};
	query[profile.authOrigin + '.id'] = profile.id;

	// Search for a profile from the given auth origin
	User.findOne(query, function(err, user){
		if(err) throw err;

		// If a user is returned, load the given user
		if(user){
			done(null, user);
		} else {
			// Otherwise, store user, or update information for same e-mail
			User.findOne({ 'email' : profile.emails[0].value }, function(err, user){
				if(err) throw err;

				if(user){
					// Preexistent e-mail, update
					user[''+profile.authOrigin] = {};
					user[''+profile.authOrigin].id = profile.id;
					user[''+profile.authOrigin].email = profile.emails[0].value;
					user[''+profile.authOrigin].name = profile.displayName;

					user.save(function(err, user){
						if(err) throw err;
						done(null, user);
					});
				} else {
					// New e-mail, create
					
					// Fixed fields
					user = {
						email : profile.emails[0].value,
						firstName : profile.displayName.split(" ")[0],
						lastName : profile.displayName.replace(profile.displayName.split(" ")[0] + " ", "")
					};

					// Dynamic fields
					user[''+profile.authOrigin] = {};
					user[''+profile.authOrigin].id = profile.id;
					user[''+profile.authOrigin].email = profile.emails[0].value;
					user[''+profile.authOrigin].name = profile.displayName;

					User.create(
						user,
						function(err, user){
							if(err) throw err;
							done(null, user);
						}
					);
				}
			});
		}
	});
};


/**
 * update profile
 */
UserSchema.statics.updateProfile = function(req, done){
	User.findOne(req.user._id, function(err, user){
		if(err) throw err;

		// If a user is returned, load the given user
		if(user){

			user.update({firstName: req.body.firstName , lastName: req.body.lastName},function(err, numberAffected, raw){
				if (err) return console.error(err);
				console.log('The number of updated documents was %d', numberAffected);
				console.log('The raw response from Mongo was ', raw);
				done(null, user);
			});
			console.log('user: ' + user.email)
		} else {
			console.log('There is no user by that id so no profile updating happening.')
		}
	});
};

var User = mongoose.model("User", UserSchema);
module.exports = User;