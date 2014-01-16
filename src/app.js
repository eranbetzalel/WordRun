var http = require('http')
  , express = require('express')
  , config = require('./config.js')
  , ChatServer = require('./chatServer.js');

var chatServer = new ChatServer();

var app = express();
var httpServer = http.createServer(app);

app.configure(function () {
  app.use(express.favicon('public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));

  app.use(app.router);
});

app.get("/", function (req, res) {
  res.redirect("/index.html");
});


httpServer.listen(config.httpPort, function () {
  chatServer.listen(httpServer);

  console.log('Word Run is listening on port ' + config.httpPort + '...');
});