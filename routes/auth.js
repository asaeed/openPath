
var request = require('request')
  , user = require('./user');

exports.status = function authStatus(req, res) {
  request.post({
    url: 'https://login.persona.org/verify',
    json: {
      assertion: req.body.assertion,
      audience: "http://ec2-23-20-219-99.compute-1.amazonaws.com:8080"
    }
  }, function(e, r, body) {
    if(body && body.email) {
      console.log("auth status: persona");

      // find user, if new user, then create them in database
      user.findByEmail(body.email, function(foundUser){
        if (!foundUser) {
          user.addUser(body.email, function(newUser){
            req.session.email = newUser.email;
            req.session.userId = newUser._id;
            newUser.status = "okay";
            res.json(newUser);
          });
        } else {
          req.session.email = foundUser.email;
          req.session.userId = foundUser._id;
          foundUser.status = "okay";
          res.json(foundUser);
        }
      });    
      
    } else {

      // if not authenticated, is user a guest?
      if (req.session.email == "guest"){
        console.log("auth status: guest");
        res.json({"email": "Guest1234", "status": "okay"});
      }

    }
  });
};

exports.logout = function authLogout(req, res) {
  req.session.destroy();
  res.redirect('/');
};

exports.guest = function authGuest(req, res) {
  // create new guest user
  user.addUser("guest", function(newGuest){
    req.session.email = newGuest.email;
    req.session.userId = newGuest._id;
    newGuest.status = "okay";
    res.json(newGuest);
  });
};