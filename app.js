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
    app = express();

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
    /**
     * set up redirect http to https

var http = http.createServer(function(req,res){
      res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
      res.end();
    }),*/
var http = http.createServer(app),
    https = https.createServer(sslOptions, app),
    io = require('socket.io').listen(https);//, { log: true }

//create peer server
/*
var PeerServer = require('peer').PeerServer;

var peerServer = new PeerServer({
  port: 9000,//9000 //8000
  ssl: {
    key: sslOptions.key,
    certificate: sslOptions.cert
  },
  path:'/openpath'
});
*/

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
  app.set('securePort', 443);//443 //3030
  app.engine('handlebars', exphbs({defaultLayout: 'main'}));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'handlebars');
  //app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret : 'jadePlant' }));
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
var users = require('./routes/users')(app);
var rooms = require('./routes/rooms')(app);
var events = require('./routes/events')(app);

/**
 * serve through http server
 */
http.listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});

/**
 * serve through https server
 */
https.listen(app.get('securePort'), function(){
  console.log("Secure Server listening on port " + app.get('securePort'));
});
