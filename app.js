
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , redis = require('redis');

// Database
var datastore = mongoose.createConnection('localhost', 'fixie')
  , pub = redis.createClient()
  , sub = redis.createClient();

// Server, Application
var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


  // Configuration
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Models
var User = require('./models/user').User
  , Thread = require('./models/thread').Thread
  , Message = require('./models/message').Message;

// Routes
app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/users', user.createUser);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
