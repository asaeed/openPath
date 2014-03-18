var User = require('../models/user');
var Auth = require('../utils/auth');

/**
 * routes 
 */
module.exports = function(app, passport){

	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
			res.render("home", { user : req.user}); 
		}else{
			res.render("home", { user : null });
		}
	});

	/**
	 * login, signup, logout
	 */
	app.get("/login", function(req, res){ 
		res.render("login");
	});

	app.post("/login",
		passport.authenticate('local',{
			successRedirect : "/",
			failureRedirect : "/login",
		})
	);

	app.get("/signup", function (req, res) {
		res.render("signup");
	});

	app.post("/signup", Auth.userExist, function (req, res, next) {
		User.signup(req.body.email, req.body.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				return res.redirect("profile");
			});
		});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});


	/**
	 * users
	 */
	app.get("/users", function (req, res) {
		User.find(function (err, items) {
			if (err) return console.error(err);
			res.send(items);
		});
	});



};