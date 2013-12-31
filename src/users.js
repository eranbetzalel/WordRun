var _ = require('underscore');
var config = require('./config.js');
var _rooms = require('./rooms.js');
var _stats = require('./stats.js');

var _io;
var _users = { };

exports.init = function (io) {
  _io = io;

  _io.sockets.on('connection', newConnection);
}

function getUserNames() {
  return _.keys(_users);
}

function addUser(userName, userProfile, socket) {
  var user = _users[userName];

  if(user)
    removeUser(userName);

  user = {
    socket: socket,
    profile: userProfile
  };

  _users[userName] = user;
  socket.user = user;

  return user;
}

function removeUser(userName) {
  delete _users[userName];
}

function newConnection(socket) {
  socket.on('login', login);
  socket.on('disconnect', logout);

  _stats.newConnection();
}

function login(userProfile, responseCallback) {
  var validationError = validateUserProfile(userProfile);
  
  if(validationError) {
    responseCallback({error: validationError});

    return;
  }

  var socket = this;
  var user = _users[userProfile.userName];

  if(!user) {
    user = addUser(userProfile.name, userProfile, socket);

    socket.on('changeRoom', changeRoom);
    socket.on('sendPrivateMessage', userSendPrivateMessage);
    socket.on('sendRoomMessage', userSendRoomMessage);
  }
  
  if(!user.room)
    _rooms.userJoinRoom(user, config.mainRoomName);

  responseCallback({ 
    userRoom: {
      name: user.room.name,
      lastMessages: user.room.lastMessages
    },
    userNames: getUserNames(),
    roomNames: _rooms.getRoomNames()
  });

  _stats.login();
}

function validateUserProfile(userProfile) {
  if(!userProfile)
    return 'Empty user profile';

  if(!userProfile.name)
    return 'Missing username';
}

function changeRoom(roomName, responseCallback) {
  var socket = this;

  var room = _rooms.getRoom(roomName);

  if(!room) {
    responseCallback({
      error: 'Could not find room.'
    });

    return;
  }

  responseCallback({
    lastMessages: room.lastMessages
  });
}

function userSendPrivateMessage(privateMessage) {
  var socket = this;

  var user = _users[privateMessage.userName];

  if(!user)
    return;
  
  user.socket.emit('newPrivateMessage', privateMessage);
}

function userSendRoomMessage(messageText) {
  var socket = this;

  var message = {
    userName: socket.user.profile.name,
    message: messageText
  };

  _io.sockets.in(socket.user.room.name).emit('newRoomMessage', message);

  var lastMessages = socket.user.room.lastMessages;

  if (lastMessages.length > config.maxRoomLastMessages)
    lastMessages.shift();

  lastMessages.push(message);
}

function logout() {
  var socket = this;

  if(socket.user)
    removeUser(socket.user.profile.name);

  _stats.logout();
}