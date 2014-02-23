define(
  ['Backbone'],
  function (Backbone) {
    'use strict';

    var message = Backbone.Model.extend({
      defaults: {
        time: null,
        userId: null,
        userName: null,
        text: null
      }
    });

    return message;
  }
);