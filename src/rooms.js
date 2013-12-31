var _ = require('underscore');
var config = require('./config.js');

var _io;
var _rooms = { };

exports.init = function init(io) {
  _io = io;

  config.defaultRoomNames.forEach(addRoom);
}

exports.getRoomNames = function getRoomNames(roomName) {
  return _.keys(_rooms);
}

exports.getRoom = function getRoom(roomName) {
  return _rooms[roomName];
}

function addRoom(roomName) {
  var room  = _rooms[roomName];
  
  if(room)
    removeRoom(roomName);

  room = {
    name: roomName,
    users: {},
    lastMessages: []
  };

  _rooms[roomName] = room;

  return room;
}

function removeRoom(roomName) {
  delete _rooms[roomName];
}

exports.userJoinRoom = function userJoinRoom(user, roomName) {
  var socket = user.socket;

  if(user.room && user.room.name === roomName)
    return user.room;

  if(user.room)
    userLeaveRoom(user, roomName);

  var newRoom;

  if(!_rooms[roomName]) {
    newRoom  = this.addRoom(roomName);
  }
  else {
    newRoom = _rooms[roomName];
  }

  socket.join(newRoom.name);

  user.room = newRoom;

  newRoom.users[user.profile.name] = user;
}

function userLeaveRoom(user, roomName)  {
  var room = _rooms[roomName];

  user.socket.leave(room.name);

  room.users[user.name] = null;

  if(room.users === {})
    delete room;
}