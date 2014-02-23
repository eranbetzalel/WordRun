var blueBirdUtil = require('../utils/blueBirdUtil.js')
  , config = require('../config.js')
  , Room = require('../models/room.js');

exports = module.exports = RoomStore;

function RoomStore() {
}

RoomStore.prototype.getRoomById = function (roomId) {
  return blueBirdUtil.mongoExec(Room.findById(roomId));
}

RoomStore.prototype.getRoomByName = function (roomName) {
  return blueBirdUtil.mongoExec(Room.findOne({ name: roomName }));
}

RoomStore.prototype.getRooms = function () {
  return blueBirdUtil.mongoExec(Room.find().sort({ createdAt: 1 }));
}

RoomStore.prototype.addRoom = function (roomData) {
  return blueBirdUtil.mongoExec(
    Room.findOneAndUpdate(
      { name: roomData.name },
      { $setOnInsert: roomData },
      { upsert: true }));
}

RoomStore.prototype.addRoom = function (roomData) {
  return blueBirdUtil.mongoExec(
    Room.findOneAndUpdate(
      { name: roomData.name },
      { $setOnInsert: roomData },
      { upsert: true }));
}

RoomStore.prototype.removeRoom = function (roomId) {
  return blueBirdUtil.mongoExec(
    Room.findOneAndRemove({
      id: roomId,
      isPermanent: false
    })
  );
}

RoomStore.prototype.addRoomMessage = function (roomId, messageData) {
  return blueBirdUtil.mongoExec(
    Room.findByIdAndUpdate(
      roomId, {
        $push: {
          lastMessages: { 
            $each: [ messageData ],
            $slice: -1 * config.maxRoomLastMessages,
            $sort: { sentAt: 1 }
          }
        }
      }));
}