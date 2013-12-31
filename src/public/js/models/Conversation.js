define(
  ['Backbone', 'models/messages'],
  function (Backbone, Messages) {
    'use strict';

    var conversation = Backbone.Model.extend({
      defaults: {
        messages: new Messages()
      }
    });

    return conversation;
  }
);