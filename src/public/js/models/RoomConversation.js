define(
  ['Backbone', 'models/messages', 'models/conversation', 'models/ChatUsers', 'underscore'],
  function (Backbone, Messages, Conversation, ChatUsers, _) {
    'use strict';

    var roomConversation = Conversation.extend({
      defaults: _.extend({
        room: null,
        users: null
      },
      Conversation.prototype.defaults),

      isCurrentRoom: function (roomName) {
        var currentRoomName = 
          this.get('room') != null ? this.get('room').get('name') : null;

        return roomName == currentRoomName;
      },

      changeRoom: function (room, usersDTO, lastMessages) {
        this.set({
          room: room,
          users: new ChatUsers(usersDTO),
          messages: new Messages(lastMessages)
        });
      },

      getUserById: function (userId) {
        var users = this.get('users');

        if(!users)
          return;

        return users.getUserById(userId);
      },

      addUser: function (userData) {
        var users = this.get('users');

        if(!users)
          return;

        return users.add(userData);
      },

      removeUser: function (userId) {
        var users = this.get('users');

        if(!users)
          return;

        var user = users.getUserById(userId);

        if(!user)
          return;

        return users.remove(user);
      }
    });

    return roomConversation;
  }
);