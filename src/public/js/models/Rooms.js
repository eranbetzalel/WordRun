define(
  ['Backbone', 'models/room'],
  function (Backbone, Room) {
    'use strict';

    var rooms = Backbone.Collection.extend({
      model: Room,

      initFromRooms: function (rooms) {
        this.reset();

        var self = this;

        _.each(rooms, function (roomData) {
          var room = new Room(roomData);

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