var Users = require('./users')
  , io = require('socket.io')
  , socketIoSession = require('./utils/socketIoSession');

exports = module.exports = ChatServer;

function ChatServer() {
  this.io = null;
  this.users = null;
}

ChatServer.prototype.start = function (httpServer, cookieParser, sessionStore) {
  var ioServer = io.listen(httpServer);

  socketIoSession.injectSession(ioServer, cookieParser, sessionStore);

  this.users = new Users(ioServer);
  this.io = ioServer;
}