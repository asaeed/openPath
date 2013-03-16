
/**
 * Module dependencies.
 */

var express = require('express')
  , cons = require('consolidate')
  , swig = require('swig')
  , routes = require('./routes')
  , user = require('./routes/user')
  //, auth = require('./routes/auth')
  , http = require('http')
  , path = require('path')
  , request = require('request');
  , store = new express.session.MemoryStore;
  
var app = express();

swig.init({ root: __dirname + '/views', allowErrors: true });

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.engine('html', cons.swig);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(express.session({secret: "coldhands", store: store}));
  //app.use(express.session({key: 'myapp', cookie: {maxAge: 60000}}));
  //app.use(express.cookieSession({secret: "meh"}));
  //app.use(express.csrf());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



// var persona = require("express-persona")(app, {
//   audience: "http://ec2-23-20-219-99.compute-1.amazonaws.com:8080",
// });
// function requireLogin(req, res, next) {

//   var options = {
//     host: 'localhost',
//     path: '/persona/verify',
//     //port: 8080,
//     method: 'POST'
//   };

//   callback = function(response) {
//     var str = '';
//     //another chunk of data has been recieved, so append it to `str`
//     response.on('data', function (chunk) {
//       str += chunk;
//     });
//     //the whole response has been recieved, so we just print it out here
//     response.on('end', function () {
//       console.log(str);
//     });
//   }
//   http.request(options, callback).end();

//   if (req.session && req.session.secret == "mozillapersona") {
//     next(); // allow the next route to run
//   } else {
//     // require the user to log in
//     res.redirect("/"); // or render a form, etc.
//   }
// }
// app.all("/users", requireLogin, function(req, res, next) {
//   next(); // if the middleware allowed us to get here,
//           // just move on to the next route handler
// });


// app.get('/auth/status', auth.status);
// app.post('/auth/login', auth.login);
// app.post('/auth/logout', auth.logout);

app.get('/', routes.index);


app.get('/logout', function(req, res) {
  req.session = null;
  res.redirect('/');
});

app.post('/auth', function(req, res) {
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



app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addItem);
app.put('/users/:id', user.updateItem);
app.delete('/users/:id', user.deleteItem);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});
