define(
  ['config', 'jquery', 'html5shiv', 'Ractive', 'socket.io', 'Backbone', 'models/chatData', 'models/message'],
  function (config, $, html5Shiv, Ractive, io, Backbone, chatData, Message) {
    'use strict';

    var chatApp = new Ractive({
      el: 'chatApp',
      template: '#chatAppTemplate',
      adaptors: [ 'Backbone' ],
      data: chatData
    });

    var getUserById = function (userId) {
      var promise =  new jQuery.Deferred();

      var user;

      //  Try to get user from current room user's
      user = chatData.roomConversation.getUserById(userId);

      if(user) {
        promise.resolve(user);
      }
      else {
        //  Try to get user from user's conversations
        user = chatData.userConversations.getUserById(userId);

        if(user) {
          promise.resolve(user);
        }
        else {
          //  If all fails - get user from server
          chatData.currentUser.getUserById(userId, function (user) {
            promise.resolve(user);
          });
        }
      }

      return promise;
    };

    var handleError = function (error) {
      alert(error);
    };

    chatApp.on({
      login: function (event) {
        if(event)
          event.original.preventDefault();

        chatData.currentUser.login(
          function (response) {
            chatData.rooms.initFromRooms(response.rooms);

            chatData.currentUser.on('newRoomMessage', function (messageData) { 
              chatData.roomConversation.addMessage(messageData);
            });

            chatData.currentUser.on('newPrivateMessage', function (messageData) {
              getUserById(messageData.userId)
                .then(function (user) {
                  chatData.userConversations.addMessage(user, messageData);
                });
            });

            chatData.currentUser.on('joinedRoom', function (user) {
              chatData.roomConversation.addUser(user);
            });

            chatData.currentUser.on('leftRoom', function (userId) {
              chatData.roomConversation.removeUser(userId);
            });

            //  Enter first room
            chatApp.fire('showRoomConversation', event, chatData.rooms.first().get('name'));

            $('.modal').fadeOut(150, function () {
              $('.modal-background').fadeOut(400);
            });
          },
          handleError);
      },

      showUserConversation: function (event, userId) {
        if(chatData.currentUser.id === userId)
          return;

        var self = this;

        getUserById(userId)
          .then(function (user) {
            if(!user)
              return;

            var userConversation = chatData.userConversations.openConversation(user);

            if(chatData.selectedConversation != userConversation)
              self.set('selectedConversation', userConversation);
          });
      },

      closeUserConversation: function (event, userId) {
        if(event)
          event.original.stopPropagation();

        chatData.userConversations.closeConversation(userId);

        if (chatData.selectedConversation.get('user').get('id') === userId)
          chatApp.fire('showRoomConversation');
      },

      showRoomConversation: function (event, roomName) {
        //  Select current room if already active or no roomName specified
        if(!roomName || chatData.roomConversation.isCurrentRoom(roomName)) {
          this.set('selectedConversation', chatData.roomConversation);
        
          return;
        }

        var room = chatData.rooms.getRoomByName(roomName);
        var self = this;

        chatData.currentUser.changeRoom(
          room,
          function (response) {
            chatData.roomConversation.changeRoom(
              room,
              response.users,
              response.lastMessages);

            self.set('selectedConversation', chatData.roomConversation);
          },
          handleError);
      },

      sendMessage: function (event) {
        if(event)
          event.original.preventDefault();

        var messageText = textToSend.value;

        if (messageText === '')
          return;

        if (chatData.selectedConversation === chatData.roomConversation) {
          //  Sends room message
          chatData.currentUser.sendRoomMessage(messageText, handleError);
        }
        else {
          var messageSentAt = Date.now();
          var destinationUserId = chatData.selectedConversation.get('user').get('id');

          //  Sends private message
          chatData.currentUser.sendPrivateMessage(
            destinationUserId,
            messageText,
            function () {
              var message = new Message({
                time: messageSentAt,
                userId: chatData.currentUser.get('id'),
                userName: chatData.currentUser.get('name'),
                text: messageText
              });

              chatData.selectedConversation.addMessage(message);
            },
            handleError);
        }

        textToSend.value = '';
      }
    });

    if(chatData.currentUser.loggedIn) {
      chatApp.fire('login');
    }
    else {
      $('.modal-background').show();
    }

    return chatApp;
  }
);