define(
  ['Backbone', 'models/chatUser', 'underscore'],
  function (Backbone, ChatUser, _) {
    'use strict';

    var chatUsers = Backbone.Collection.extend({
      model: ChatUser,
      
      initFromUserNames: function (usernames) {
        this.reset();

        var self = this;

        _.each(usernames, function (username) {
          var chatUser = new ChatUser({ name: username });

          self.add(chatUser);
        });
      },

      getUserByName: function (roomName) {
        return this.findWhere({ name: roomName });
      }
    });

    return chatUsers;
  }
);