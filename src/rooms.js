var _ = require('underscore')
  , config = require('./config.js')
  , Room = require('./room.js');

exports = module.exports = Rooms;

function Rooms() {
  this._rooms = {};
  this._userRoom = {};

  var self = this;

  config.defaultRoomNames.forEach(function(roomName) { 
    var room = self.addRoom(roomName);

    room.isPermanent = true;
  });
}

Rooms.prototype.getRoomNames = function () {
  return _.keys(this._rooms);
}

Rooms.prototype.getRoom = function (roomName) {
  return this._rooms[roomName];
}

Rooms.prototype.getUserRoom = function (user) {
  return this._userRoom[user.id];
}

Rooms.prototype.addRoom = function (roomName) {
  var room  = this._rooms[roomName];
  
  if(room)
    return room;

  room = new Room(roomName);

  this._rooms[roomName] = room;

  return room;
}

Rooms.prototype.removeRoom = function (roomName) {
  var room = this._rooms[roomName];

  if(room.isPermanent)
    return;

  delete this._rooms[roomName];
}

Rooms.prototype.userJoinRoom = function (user, roomName) {
  var socket = user.socket;
  var userRoom = this._userRoom[user.id];

  if(userRoom)
  {
    //  User is already in that room
    if(userRoom.name === roomName)
      return userRoom;

    //  Leaves current room to join a new one
    this.userLeaveRoom(user, roomName);
  }

  var newRoom = this._rooms[roomName];

  if(!newRoom)
    newRoom  = this.addRoom(roomName);

  socket.join(newRoom.name);
  
  this._userRoom[user.id] = newRoom;

  return newRoom;
}

Rooms.prototype.userLeaveRoom = function (user, roomName)  {
  var room = this._rooms[roomName];

  user.socket.leave(room.name);

  delete this._userRoom[user.id];
}