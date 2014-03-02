define(
  ['Backbone', 'models/baseCollection', 'models/room'],
  function (Backbone, BaseCollection, Room) {
    'use strict';

    var rooms = BaseCollection.extend({
      model: Room,

      getRoomByName: function (roomName) {
        return this.findWhere({ name: roomName });
      }
    });

    return rooms;
  }
);