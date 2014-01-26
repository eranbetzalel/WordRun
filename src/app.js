var http = require('http')
  , express = require('express')
  , config = require('./config')
  , ChatServer = require('./chatServer');

var chatServer = new ChatServer();

var app = express();
var httpServer = http.createServer(app);

var sessionStore = new express.session.MemoryStore();
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

app.get("/isLoggedIn", function (req, res) {
  res.json({ loggedIn: req.session.userId != undefined });
});

app.get("*", function (req, res) {
  res.sendfile("./public/index.html");
});

httpServer.listen(config.httpPort, function () {
  chatServer.start(httpServer, cookieParser, sessionStore);

  console.log('Word Run is listening on port ' + config.httpPort + '...');
});