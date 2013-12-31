define(
  ['Backbone', 'models/messages', 'models/conversation', 'underscore'],
  function (Backbone, Messages, Conversation, _) {
    'use strict';

    var roomConversation = Conversation.extend({
      defaults: _.extend({
        room: null
      },
      Conversation.prototype.defaults),

      changeRoom: function (room, lastMessages) {
        this.set({
          room: room,
          messages: new Messages(lastMessages)
        });
      }
    });

    return roomConversation;
  }
);