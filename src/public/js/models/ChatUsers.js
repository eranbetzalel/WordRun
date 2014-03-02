define(
  ['Backbone', 'models/baseCollection', 'models/chatUser', 'underscore'],
  function (Backbone, BaseCollection, ChatUser, _) {
    'use strict';

    var chatUsers = BaseCollection.extend({
      model: ChatUser,
      
      getUserById: function (userId) {
        return this.findWhere({ id: userId });
      }
    });

    return chatUsers;
  }
);