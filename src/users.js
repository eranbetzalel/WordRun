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

    //socket.on('joinRoom', userJoinRoom);
    //socket.on('changeRoom', changeRoom);
    //socket.on('privateMessage', userSendPrivateMessage);
    //socket.on('roomMessage', userSendRoomMessage);
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

//function changeRoom(roomName) {
//  var socket = this;
//}

//function userSendPrivateMessage(privateMessage) {
//  var socket = this;
//}

//exports.userSendRoomMessage = function (message) {
//  var socket = this;

//  socket.broadcast.to(socket.user.room).emit('message', message);

//  var messages = _rooms[roomName].lastMessages;

//  if (messages.length > config.maxRoomLastMessages)
//    messages.shift();

//  messages.push(message);
//}

function logout() {
  var socket = this;

  if(socket.user)
    removeUser(socket.user.profile.name);

  _stats.logout();
}