define(
  ['Backbone', 'models/baseCollection', 'models/message', 'config'],
  function (Backbone, BaseCollection, Message, config) {
    'use strict';

    var messages = BaseCollection.extend({
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