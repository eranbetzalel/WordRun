var room = function Room(roomName) {
  this.name = roomName;
  this.users = {};
  this.lastMessages = [];
  this.isPermanent = false;
}

module.exports = room;