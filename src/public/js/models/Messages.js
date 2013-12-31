define(
  ['Backbone', 'models/message', 'config'],
  function (Backbone, Message, config) {
    'use strict';

    var messages = Backbone.Collection.extend({
      model: Message,

      addMessage: function (message) {
        if (this.length > config.maxTextMessages)
          this.shift();

        this.add(message);
      }
    });

    return messages;
  }
);