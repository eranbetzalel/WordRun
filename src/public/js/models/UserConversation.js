define(
  ['Backbone', 'models/messages', 'models/conversation', 'underscore'],
  function (Backbone, Messages, Conversation, _) {
    'use strict';

    var userConversation = Conversation.extend({
      defaults: _.extend({
        user: null,
        activeConversation: true
      }, Conversation.prototype.defaults)
    });

    return userConversation;
  }
);