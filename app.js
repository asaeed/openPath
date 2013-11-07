/**
 * Module dependencies.
 */

var express = require('express')
  , cons = require('consolidate')
  , swig = require('swig')
  , routes = require('./routes') 
  , auth = require('./routes/auth')
  , user = require('./routes/user')
  , eventRoute = require('./routes/event')
  , sessionRoute = require('./routes/session')
  , email = require('./routes/email')
  , http = require('http')
  , path = require('path')
//  , gravatar = require('gravatar')
  , request = require('request');

var app = express();

//
// CONFIG
//

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
  app.use(express.cookieParser('coldhands'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));
  //app.use(express.csrf());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//
// Security Middleware (must go before Routes)
//

function requireLogin(req, res, next) {
  //auth.status(req, res, function(){
  //  console.log("checking auth - user email: " + JSON.stringify(res.body));
  //}

  console.log("session email: " + req.session.email);
  //if (req.session.email == "asaeed@gmail.com") {
  if (req.session && req.session.email) {
    next();
  } else {
    res.redirect("/");
  }
}

app.all("/main", requireLogin, function(req, res, next) {next();});
app.all("/users", requireLogin, function(req, res, next) {next();});
app.all("/users/*", requireLogin, function(req, res, next) {next();});
app.all("/sessions", requireLogin, function(req, res, next) {next();});
app.all("/sessions/*", requireLogin, function(req, res, next) {next();});
app.all("/events", requireLogin, function(req, res, next) {next();});
app.all("/events/*", requireLogin, function(req, res, next) {next();});

app.all("/update/*", requireLogin, function(req, res, next) {next();});
app.all("/email", requireLogin, function(req, res, next) {next();});


//
// ROUTES - make sure to keep up to date
//

app.all('/*', function(req, res, next) {
  if (req.headers.host.match(/^www/) !== null ) {
    res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
  } else {
    next();     
  }
})

app.get('/', routes.index);
app.get('/main', routes.main);
app.get('/about', routes.about);
app.get('/privacy-policy', routes.privacyPolicy);
app.get('/terms-of-service', routes.termsOfService);
app.get('/press-kit', routes.pressKit);

app.post('/auth/status', auth.status);
app.get('/auth/logout', auth.logout);
app.get('/auth/guest', auth.guest);

app.put('/update/:collection/:id/:key/:value', user.updateItemData);
app.post('/email', email.sendEmailRequest);

app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addItem);
app.put('/users/:id', user.updateItem);
app.delete('/users/:id', user.deleteItem);

app.get('/sessions', sessionRoute.findAll);
app.get('/sessions/:id', sessionRoute.findById);
app.post('/sessions', sessionRoute.addItem);
app.put('/sessions/:id', sessionRoute.updateItem);
app.delete('/sessions/:id', sessionRoute.deleteItem);

app.get('/events', eventRoute.findAll);
app.get('/events/:id', eventRoute.findById);
app.post('/events', eventRoute.addItem);
app.put('/events/:id', eventRoute.updateItem);
app.delete('/events/:id', eventRoute.deleteItem);

/*
app.get('/gravatar/',function(req, res){
console.log('requesting gravatar')
	var gravatarUrl = gravatar.url( req, {s: '200', r: 'pg', d: '404'});
	var secureUrl = gravatar.url( req, {s: '100', r: 'x', d: 'retro'}, true);
	
	console.log('res gravatar',gravatarUrl)
	res.json({
		gravatarUrl : gravatarUrl,
		secureUrl : secureUrl
	});
});
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});
