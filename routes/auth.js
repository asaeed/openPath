
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
      req.session.email = body.email;
      //res.json({ success: true });
    } else {
      //req.session.destroy();
      //res.json({ success: false });

      // if not authenticated, is user a guest?
      if (req.session.email == "guest"){
        body = {"name": "Guest1234", "status": "okay"};
      }
    }
    res.json(body);
    //typeof callback == "function" && callback();
  });

  
};

exports.logout = function authLogout(req, res) {
  //req.session = null;  // this still allows reloading prior page loads
  req.session.destroy();
  res.redirect('/');
};

exports.guest = function authGuest(req, res) {
  req.session.email = "guest";
  res.json({"name": "Guest1234", "status": "okay"});

};