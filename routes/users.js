var User = require('../models/user');
var Auth = require('../utils/auth');
var Utils = require('../utils/utils');

/**
 * users 
 */
module.exports = function(app){

	app.get("/users", function (req, res) {
		//var admin = req.user.email === 'jamiegilmartin@gmail.com' || req.user.email === 'jaredlamenzo@gmail.com';
		//if(!admin) res.redirect("/");

		User.find(function (err, items) {
			if (err) return console.error(err);
			res.send(items);
			//res.render("admin/users", { user: items });
		});
	});

	//get user by email
	app.get("/user/:email", function (req, res) {
		User.findByEmail(req, function (err, user) {
			if (err) return console.error(err);

			//TODO: if same user, if private profile & diff user

			// If a user is returned, load the given user
			//console.log('user is',user,req.session.room,req.session.event);
			var publicUser = {
				firstName:  user.firstName,
				lastName:   user.lastName,
				email:      user.email,
				//salt:       String,
				//hash:       String,
				//facebook:{
				//	id:       String,
				//	email:    String,
				//	name:     String
				//},
				//google:{
				//	id:       String,
				//	email:    String,
				//	name:     String
				//},
				//dateCreated:  Date,
				//dateModified: Date,
				gradeLevel : user.gradeLevel,
				interests : user.interests,
				coLearners : user.coLearners,
				currentRoom : req.session.room,
				currentEvent : req.session.event,
				settings : {
					alerts : {
						colearnerJoin : Boolean,
						nearEvent : Boolean,
						allEvents : Boolean
					},
					publicProfile : Boolean
				}
			}
			res.send(publicUser);
		});
	});

	//profile post
	app.put("/user/profile", Auth.userExist, function(req, res, next){
		console.log('update profile',req.user._id,req.body.firstName,req.body.lastName);
		User.updateProfile(req , function(err,user){
			if(err) throw err;
			console.log(user.email + '\'s profile updated');
			res.redirect("/#/profile");
		});
	});

	app.put("/user/settings", Auth.userExist, function(req, res, next){
		console.log('update settings',req.user._id, req.body);
		User.updateSettings(req , function(err,user){
			if(err) throw err;
			console.log(user.email + '\'s settings updated');
			//res.redirect("/#/profile");
			res.send(user.settings);
		});
	});
};