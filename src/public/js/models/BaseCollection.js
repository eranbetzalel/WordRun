define(
  ['Backbone'],
  function (Backbone) {
    'use strict';

    var baseCollection = Backbone.Collection.extend({
      //  Constractor that handle models as well as raw model data
      initialize: function (objects) {
        var self = this;
        var model = self.model;

        _.each(objects, function (obj) {
          if(obj instanceof model) {
            self.add(obj);
          }
          else {
            self.add(new model(obj));
          }
        });
      }
    });

    return baseCollection;
  }
);