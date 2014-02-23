var blueBirdUtil = require('../utils/blueBirdUtil.js')
  , ObjectId = require('mongoose').Types.ObjectId
  , User = require('../models/user.js');

exports = module.exports = UserStore;

function UserStore() {
}

UserStore.prototype.getUserNames = function () {
  return blueBirdUtil.mongoExec(User.find().select('name'));
}

UserStore.prototype.getUserById = function (userId) {
  return blueBirdUtil.mongoExec(User.findById(userId));
}

UserStore.prototype.getUserByName = function (userName) {
  return blueBirdUtil.mongoExec(User.findOne({ name: userName }));
}

UserStore.prototype.getUsersByRoomId = function (roomId) { 
  return blueBirdUtil.mongoExec(User.find({ room: new ObjectId(roomId) }));
}

UserStore.prototype.getLoggedOutUsers = function () {
  return blueBirdUtil.mongoExec(User.find({ loggedOutAt: { $ne: null } }));
}

UserStore.prototype.addUser = function (userData) {
  var user = new User(userData);

  return blueBirdUtil.mongoSaveOne(user);
}

UserStore.prototype.updateUser = function (userId, userData) {
  return blueBirdUtil.mongoExec(User.findByIdAndUpdate(userId, userData));
}

UserStore.prototype.removeUser = function (userId) {
  return blueBirdUtil.mongoExec(User.findByIdAndRemove(userId));
}

UserStore.prototype.userSwitchRoom = function (userId, roomId) {
  return this.updateUser(userId, { room: new ObjectId(roomId) });
}