define(
  ['Backbone'],
  function (Backbone) {
    'use strict';

    var baseUserModel = Backbone.Model.extend({
      defaults: {
        id: null,
        name: null,
        age: null,
        gender: null
      }
    });

    return baseUserModel;
  }
);