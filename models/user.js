var mongoose = require('mongoose');
var hash = require('../utils/hash');
var Interest = require('../models/interest');

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
	dateModified: Date,
	gradeLevel : String,
	interests : [String],
	coLearners : [String],
	settings : {
		alerts : {
			colearnerJoin : Boolean,
			nearEvent : Boolean,
			allEvents : Boolean
		},
		publicProfile : Boolean
	}
	//TODO : locations, settings
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
			dateModified : Date.now(),
			//default settings
			settings : {
				alerts : {
					colearnerJoin : true,
					nearEvent : true,
					allEvents : true
				},
				publicProfile : true
			}
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
 * find by email
 */
UserSchema.statics.findByEmail = function(req, done){
	//TODO: auth here check if same id
	var email = req.params.email;
	User.findOne({'email': email}, function(err, user){
		if(user){
			done(null,user);
		}else{
			console.log('Can\'t find user by email.');
		}
	});
};
/**
 * update profile
 */
UserSchema.statics.updateProfile = function(req, done){
	User.findOne({_id:req.user._id}, function(err, user){
		if(err) throw err;

		// If a user is returned, load the given user
		if(user){
			user.update({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				gradeLevel : req.body.gradeLevel,
				interests : req.body.interests
				//colearners
			},function(err, numberAffected, raw){
				if (err) return console.error(err);
				console.log('The number of updated documents was %d', numberAffected);
				console.log('The raw response from Mongo was ', raw);
				done(null, user);
			});
			console.log('user: ' + user.email)
		} else {
			console.log('There is no user by that id so no profile updating happening.');
		}
	});
};
/**
 * update settings
 */
UserSchema.statics.updateSettings = function(req, done){
	console.log('updateSettings',req.user._id,req.body)
	User.findOne({_id:req.user._id}, function(err, user){
		if(err) throw err;

		// If a user is returned, load the given user
		if(user){
			user.update({
				settings : {
					alerts : {
						colearnerJoin : req.body.alerts.colearnerJoin,
						nearEvent : req.body.alerts.nearEvent,
						allEvents : req.body.alerts.allEvents
					},
					publicProfile : req.body.publicProfile
				}
			},function(err, numberAffected, raw){
				if (err) return console.error(err);
				console.log('The number of updated documents was %d', numberAffected);
				console.log('The raw response from Mongo was ', raw);
				done(null, user);
			});
			console.log('user: ' + user.email)
		} else {
			console.log('There is no user by that id so no settings updating happening.');
		}
	});
};
/*
UserSchema.statics.deleteAll = function(req, done) {
	this.remove( function(err, user){
		// if(err) throw err;
		if(err) return done(err);

	});
};
*/

var User = mongoose.model("User", UserSchema);
module.exports = User;