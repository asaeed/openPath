/**
 * @author jamiegilmartin@gmail.com
 * @see http://scotch.io/tutorials/javascript/easy-node-authentication-setup-and-local
 * @see http://itp.nyu.edu/~sve204/liveweb_fall2013/week5.html
 */


/**
 * Module dependencies.
 */
var express = require('express'),
    exphbs  = require('express3-handlebars'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require("passport"),
    flash = require("connect-flash"),
    //less = require('less'),
    app = express();

//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//
//var credentials = {key: privateKey, cert: certificate};
//

var sslOptions = {
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.crt'),
  ca: fs.readFileSync('./ssl/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};



//config
var env = process.env.NODE_ENV || 'development',
    config = require('./config')[env];

//create server
var http = http.createServer(app),
    //https = https.createServer(credentials, app),
    io = require('socket.io').listen(http);//, { log: true }

//connect to mongo
mongoose.connect( config.db );
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay, connected to openpathdb');
});

//get mongoose models
var models_dir = __dirname + '/models';
fs.readdirSync(models_dir).forEach(function (file) {
  if(file[0] === '.') return; 
  require(models_dir+'/'+ file);
});


//require passport
require('./utils/passport')(passport, config);

/**
 * Config
 */
app.configure(function(){
  app.set('port', process.env.PORT || 8080);//8080
  //app.set('securePort', 8081);//443
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'handlebars');
  //app.set('view options', {layout: false});
  //app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());//errors?
  //app.use(express.methodOverride());//?
  app.use(express.cookieParser());
  app.use(express.session({secret : 'jadePlant' }));
  //app.use(less({ src: __dirname + '/public', compress: true }));
  //app.use(express.compiler({ src : __dirname + '/public', enable: ['less']}));
  app.use(express.static(__dirname + '/public'));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(function(err, req, res, next){
    console.error(err.stack);
    //res.send(500, 'Something broke!');
    res.render("error", {type:500});
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 *routes
 */
var routes = require('./routes/routes')(app,io,passport);

/**
 * serve through http server
 */
http.listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});
/*
https.listen(app.get('securePort'), function(){
  console.log("Server listening on port " + app.get('securePort'));
});
*/
var secureServer = https.createServer(sslOptions,app).listen('3030', function(){
  console.log("Secure Express server listening on port 3030");
});