
/**
 * Module dependencies.
 */

var express = require('express')
  , cons = require('consolidate')
  , swig = require('swig')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

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
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.cookieParser());
  app.use(express.session({secret: "mozillapersona"}));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require("../index.js")(app, {
  audience: "http://localhost:3000"
});

app.get('/', routes.index);

app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addItem);
app.put('/users/:id', user.updateItem);
app.delete('/users/:id', user.deleteItem);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});
