define(
  ['Backbone', 'models/chatUser', 'underscore'],
  function (Backbone, ChatUser, _) {
    'use strict';

    var chatUsers = Backbone.Collection.extend({
      model: ChatUser,
      
      getUserById: function (userId) {
        return this.findWhere({ id: userId });
      }
    });

    return chatUsers;
  }
);