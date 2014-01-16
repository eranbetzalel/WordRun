var Users = require('./users');
var socketIo = require('socket.io');

exports = module.exports = ChatServer;

function ChatServer() {
  this.io = null;
  this.users = null;

  var self = this;

  this.listen = function listen(server) {
    if(!self.io) {
      self.io = socketIo.listen(server);
      self.users = new Users(self.io);
    }

    return self.io;
  }
}