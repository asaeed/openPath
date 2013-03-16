
var request = require('request');

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
      //res.json({ success: false });
    }
    res.json(body);
  });
};


exports.logout = function authLogout(req, res) {
  //req.session = null;
  req.session.destroy();
  res.redirect('/');
};