var _stats = require('./stats.js');

var _io;

exports.initialize = function(io) {
  _io = io;

  _io.sockets.on('connection', newConnection);
};

function newConnection(socket) {
  socket.on('login', userLogin);
  socket.on('disconnect', logout);

  _stats.newConnection();
}

function userLogin(userProfile) {
  this.user = { 
    profile: userProfile
  };

  userJoinRoom(this, 'general');

  this.on('joinRoom', userJoinRoom);
  this.on('roomMessage', userSendRoomMessage);
  this.on('privateMessage', userSendPrivateMessage);

  _stats.login();
}

function userJoinRoom(socket, roomName) {
  socket.join(roomName);
  socket.user.room = roomName;
}

function userSendRoomMessage(roomMessage) {
}

function userSendPrivateMessage(privateMessage) {
}

function logout(socket) {
  console.logout();
}