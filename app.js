/* Main Application */

/**
 * Module dependencies.
 */

// Application DSL/Required Libs
var express = require('express')
  , connect = require('connect')
  , sessionStore = new connect.middleware.session.MemoryStore()
  , cookieParser = express.cookieParser('boo')
  , util = require('util')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , redis = require('redis')
  , markdown = require('node-markdown').Markdown;

// Database
var datastore = mongoose.connect('localhost', 'fixie')
  , pub = redis.createClient()
  , sub = redis.createClient();

// Server, Application
var app    = express()
  , server = http.createServer(app)
  , io     = require('socket.io').listen(server);

// Socket.io Session Handling
var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(cookieParser);
  app.use(express.session({ store: sessionStore }));
  //app.use(express.session());
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
app.get('/users/:username', user.showUser);

// Session Routes
app.get('/sessions/new', sessions.newSession);
app.post('/sessions', sessions.newSession_post);
app.get('/sessions/destroy', sessions.destroySession);

// Threads Routes
app.get('/threads', thread.listThreads);
app.get('/threads/new', thread.createThread);
app.post('/threads', thread.createThread_post);
app.get('/threads/:id', thread.showThread);


// Server
server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


// Models
var Message = require('./models/message').Message
  , User    = require('./models/user').User
  , Thread  = require('./models/thread').Thread;

// Message Methods
var saveMessage = function(socket, data) {
  var message = new Message(data);
  
  Thread.findById(data.room.split('/')[2], function(err, thread) {
        thread.messages.push(message._id);

        thread.save(function(err){
            if(err) {
              util.log('\033[32m'+'info: \033[0m '+err);
            } else {
              util.log('\033[32m'+'info: \033[0m thread saved');
            }
          });
      });
  
  message.save(function(err) {
    if(err) {
      util.log('\033[32m'+'info: \033[0m '+err);
    } else {
      util.log('\033[32m'+'info: \033[0m message saved');
      broadcastMessage(socket, data);
    } 
  });
};

var broadcastMessage = function(socket, data) {
  io.sockets.in(data.room).emit('message', {
    body:        data.body,
    author:      data.authorName,
    dateCreated: new Date,
    room:        data.room
  });
}

var subscribe = function(socket, data) {
  socket.broadcast.emit('addroom', { room: data.room});
  socket.join(data.room);
}


//Socket Connection
sessionSockets.on('connection', function (err, socket, session) {
  util.log('\033[32m'+'info: \033[0m Connection Established');

  socket.on('message', function(data) {
      data.body = markdown(data.body);
      data.author = session.user._id;
      data.authorName = session.user.username;
      saveMessage(socket, data);
  });

  socket.on('subscribe', function(data) {
    subscribe(socket, data);
  });
});