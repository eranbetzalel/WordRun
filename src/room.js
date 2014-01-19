var _ = require('underscore');

exports = module.exports = Room;

function Room(roomName) {
  this.name = roomName;
  this.users = {};
  this.lastMessages = [];
  this.isPermanent = false;
}

Room.prototype.getUserNames = function () {
  return _.keys(this.users);
}