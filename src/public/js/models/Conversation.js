define(
  ['Backbone', 'models/messages'],
  function (Backbone, Messages) {
    'use strict';

    var conversation = Backbone.Model.extend({
      defaults: {
        messages: new Messages()
      },

      addMessage: function (message) {
        var messages = this.get('messages');

        if(messages)
          messages.addMessage(message);
      }
    });

    return conversation;
  }
);