define(
  ['Backbone', 'models/baseUser'],
  function (Backbone, BaseUser) {
    'use strict';

    var chatUser = BaseUser.extend({
      defaults: _.extend({}, BaseUser.prototype.defaults)
    });

    return chatUser;
  }
);