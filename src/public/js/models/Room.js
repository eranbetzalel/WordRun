define(
  ['Backbone'],
  function (Backbone) {
    'use strict';

    var room = Backbone.Model.extend({
      defaults: {
        id: null,
        name: null
      }
    });

    return room;
  }
);