define(
  ['Backbone'],
  function (Backbone) {
    'use strict';

    var room = Backbone.Model.extend({
      defaults: {
        name: null
      }
    });

    return room;
  }
);