var http = require('http')
  , express = require('express')
  , RedisStore = require('connect-redis')(express)
  , mongoose = require('mongoose')
  , config = require('./config');

var app = express();
var httpServer = http.createServer(app);

var sessionStore = 
  config.redisStore ? new RedisStore(config.redisStore) : new express.session.MemoryStore();

var cookieParser = express.cookieParser(config.sessionSecret);

app.configure(function () {
  app.use(express.logger('dev'));
  app.use(express.favicon('public/favicon.ico'));
  app.use(express.static(__dirname + '/public'));
  app.use(cookieParser);
  app.use(express.session({ store: sessionStore }));
  app.use(app.router);
  app.use(express.errorHandler());
});

app.get("/isLoggedIn",  function (req, res) {
  global.chatController.isUserLoggedIn(req, res)
});

app.get("*", function (req, res) {
  res.sendfile("./public/index.html");
});

mongoose.connect(config.mongoDbUri);

httpServer.listen(config.httpPort, function () {
  var ioServer = require('socket.io').listen(httpServer);

  require('./utils/socketIoSession').injectSession(ioServer, cookieParser, sessionStore);

  var ChatController = require('./chatController');

  var UserStore = require('./stores/userStore');
  var RoomStore = require('./stores/roomStore');

  global.chatController =
    new ChatController(ioServer, new UserStore(), new RoomStore());

  global.chatController
    .init()
    .then(function () {
      console.log('Word Run is listening on port ' + config.httpPort + '...');
    });
});