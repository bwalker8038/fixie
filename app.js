/* Main Application */

/**
 * Module dependencies.
 */

// Application DSL/Required Libs
var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , redis = require('redis');

// Database
var datastore = mongoose.connect('localhost', 'fixie')
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


// Routes
var routes = require('./routes')
  , user = require('./routes/user')
  , sessions = require('./routes/session')
  , thread = require('./routes/thread');

// Index
app.get('/', routes.index);

// User Routes
app.get('/users/new', user.createUser);
app.post('/users', user.createUser_post);

// Session Routes
app.get('/sessions/new', sessions.newSession);
app.post('/sessions', sessions.newSession_post);
app.get('/sessions/destroy', sessions.destroySession);

// Threads Routes
app.get('/threads/new', thread.createThread);
app.post('/threads', thread.createThread_post);
app.get('/threads/:id', thread.showThread);


// Server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
