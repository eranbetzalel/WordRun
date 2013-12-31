define(
  ['Backbone', 'models/room'],
  function (Backbone, Room) {
    'use strict';

    var rooms = Backbone.Collection.extend({
      model: Room,

      initFromRoomNames: function (roomNames) {
        this.reset();

        var self = this;

        _.each(roomNames, function (roomName) {
          var room = new Room({ name: roomName });

          self.add(room);
        });
      },

      getRoomByName: function (roomName) {
        return this.findWhere({ name: roomName });
      }
    });

    return rooms;
  }
);