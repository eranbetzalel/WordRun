define(
  ['Backbone', 'models/messages', 'models/conversation', 'underscore'],
  function (Backbone, Messages, Conversation, _) {
    'use strict';

    //  TODO: fetch actual messages from server
    var fetchMessages = function () {
      return [
        { time: '11:22:00', userName: userName, text: 'Testing messages...1' },
        { time: '11:22:00', userName: userName, text: 'Testing messages...2' },
        { time: '11:22:00', userName: userName, text: 'Testing messages...3' } ];
    };

    var userConversation = Conversation.extend({
      defaults: _.extend({
        user: null,
        activeConversation: true
      }, Conversation.prototype.defaults),

      initialize: function () {
        this.set(messages, fetchMessages());
      }
    });

    return userConversation;
  }
);