define(
  ['Backbone', 'models/UserConversation'],
  function (Backbone, UserConversation) {
    'use strict';

    var userConversations = Backbone.Collection.extend({
      model: UserConversation,

      getConversation: function (user) {
        return this.findWhere({ user: user });
      },

      openConversation: function (user) {
        var userConversation = this.getConversation(user);

        if(!userConversation) {
          userConversation = new UserConversation({ user: user });

          this.add(userConversation);
        }

        return userConversation;
      },

      closeConversation: function (user) {
        var userConversation = this.getConversation(user);

        userConversation.set({ activeConversation: false });

        return userConversation;
      }
    });

    return userConversations;
  }
);