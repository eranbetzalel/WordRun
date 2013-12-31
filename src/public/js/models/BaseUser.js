define(
  ['Backbone'],
  function (Backbone) {
    'use strict';

    var baseUserModel = Backbone.Model.extend({
      defaults: {
        name: null,
        age: null,
        gender: null
      }
    });

    return baseUserModel;
  }
);