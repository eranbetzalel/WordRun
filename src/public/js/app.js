define(
  ['config', 'jquery', 'html5shiv', 'Ractive', 'moment', 'socket.io', 'Backbone', 'models/chatData', 'models/message'],
  function (config, $, html5Shiv, Ractive, moment, io, Backbone, chatData, Message) {
    'use strict';

    var chatApp = new Ractive({
      el: 'chatApp',
      template: '#chatAppTemplate',
      adaptors: [ 'Backbone' ],
      data: chatData
    });

    var handleError = function (error) {
      alert(error);
    };

    chatApp.on({
      login: function (event) {
        event.original.preventDefault();

        chatData.currentUser.login(
          function (response) {
            chatData.rooms.initFromRoomNames(response.roomNames);

            var userRoom = chatData.rooms.getRoomByName(response.userRoom.name);

            chatData.roomConversation.changeRoom(
              userRoom, 
              response.userRoom.lastMessages,
              response.userNames);

            chatApp.fire('showRoomConversation');

            chatData.currentUser.on('newRoomMessage', function (response) { 
              var message = new Message({
                time: moment().format('HH:mm:ss'),
                userName: response.userName,
                text: response.message
              });

              chatData.roomConversation.get('messages').addMessage(message);
            });

            chatData.currentUser.on('newPrivateMessage', function (response) {
              chatData.userConversations.addMessage(response.userName, response.message);
            });

            chatData.currentUser.on('joinedRoom', function (user) {
              chatData.userConversations.addMessage(response.userName, response.message);
            });

            chatData.currentUser.on('leftRoom', function (user) {
              chatData.userConversations.addMessage(response.userName, response.message);
            });

            $('.modal').fadeOut(150, function () {
                $('.modal-background').fadeOut(400);
            });
          },
          handleError);
      },

      showUserConversation: function (event, userName) {
        if(chatData.currentUser.name === userName)
          return;

        var user = chatData.roomConversation.users.getUserByName(userName);

        if(!user)
          return;

        var selectedUser = chatData.selectedConversation.get('user');

        if(selectedUser === user)
          return;

        var userConversation = chatData.userConversations.openConversation(user);

        chatData.selectedConversation = userConversation;
      },

      closeUserConversation: function (event, userName) {
        var user = chatData.roomConversation.users.getUserByName(userName);

        var userConversation = chatData.userConversations.closeConversation(user);
      
        if (chatData.selectedConversation === userConversation)
          chatApp.fire('showRoomConversation');
      },

      showRoomConversation: function (event, roomName) {
        if(!roomName || chatData.roomConversation.get('room').get('name') === roomName) {
          if(chatData.roomConversation != chatData.selectedConversation)
            chatData.selectedConversation = chatData.roomConversation;
        
          return;
        }

        var room = chatData.rooms.getRoomByName(roomName);

        chatData.currentUser.changeRoom(room, function (response) {
          chatData.roomConversation.changeRoom(
            room, 
            response.lastMessages, 
            response.userNames);

          chatData.selectedConversation = chatData.roomConversation;
        });
      },

      sendMessage: function (event) {
        event.original.preventDefault();

        if (textToSend.value === '')
          return;

        if (chatData.selectedConversation === chatData.roomConversation) {
          chatData.currentUser.sendRoomMessage(textToSend.value);
        }
        else {
          chatData.currentUser.sendPrivateMessage(
            chatData.selectedConversation.get('user').get('name'),
            textToSend.value);
        }

        var message = new Message({
          time: moment().format('HH:mm:ss'),
          userName: chatData.currentUser.get('name'),
          text: textToSend.value
        });

        chatData.selectedConversation.get('messages').addMessage(message);

        textToSend.value = '';
      }
    });

    return chatApp;
  }
);