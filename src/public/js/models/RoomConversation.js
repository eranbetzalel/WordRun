define(
  ['Backbone', 'models/messages', 'models/conversation', 'models/ChatUsers', 'underscore'],
  function (Backbone, Messages, Conversation, ChatUsers, _) {
    'use strict';

    var roomConversation = Conversation.extend({
      defaults: _.extend({
        room: null,
        users: null
      },
      Conversation.prototype.defaults),

      changeRoom: function (room, lastMessages, userNames) {
        this.users = new ChatUsers();
        this.users.initFromUserNames(userNames);

        this.set({
          room: room,
          messages: new Messages(lastMessages)
        });
      }
    });

    return roomConversation;
  }
);