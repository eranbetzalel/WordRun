var http = require('http');
var express = require('express');
var socketIo = require('socket.io');

var config = require('./config.js');
var chat = require('./chat.js');

var app = express();
var server = http.createServer(app);
var io = socketIo.listen(server, { 'log level': 1 });

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

server.listen(config.httpPort, function () {
  chat.initialize(io);
  console.log('Word Run is listening on port ' + config.httpPort + '...');
});