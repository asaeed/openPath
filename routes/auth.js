
var request = require('request');

exports.logout = function authLogout(req, res) {
  req.session = null;
  res.redirect('/');
});

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
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

