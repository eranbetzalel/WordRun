define(
  ['Backbone', 'models/baseCollection', 'models/UserConversation'],
  function (Backbone, BaseCollection, UserConversation) {
    'use strict';

    var userConversations = BaseCollection.extend({
      model: UserConversation,

      getConversationByUserId: function (userId) {
        return this.find(function (userConversation) {
          var user = userConversation.get('user');

          return user && user.get('id') == userId;
        });
      },

      getUserById: function (userId) {
        var userConversation = this.getConversationByUserId(userId);

        if(!userConversation)
          return null;

        return userConversation.user;
      },

      openConversation: function (user) {
        var userConversation = this.getConversationByUserId(user.id);

        if(!userConversation) {
          userConversation = new UserConversation({ user: user });

          this.add(userConversation);
        }

        userConversation.set({ activeConversation: true });

        return userConversation;
      },

      closeConversation: function (userId) {
        var userConversation = this.getConversationByUserId(userId);

        userConversation.set({ activeConversation: false });
      },

      addMessage: function (user, messageData) {
        var userConversation = this.openConversation(user);

        userConversation.get('messages').addMessage(messageData);
      }
    });

    return userConversations;
  }
);