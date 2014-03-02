define(
  ['config', 'jquery', 'Ractive', 'socket.io', 'Backbone', 'models/chatData', 'models/rooms', 'models/room', 'models/ChatUsers', 'models/messages', 'models/message'],
  function (config, $, Ractive, io, Backbone, chatData, Rooms, Room, ChatUsers, Messages, Message) {
    'use strict';

    var chatApp = new Ractive({
      el: 'chatApp',
      template: '#chatAppTemplate',
      adaptors: [ 'Backbone' ],
      data: chatData
    });

    var getUserById = function (userId) {
      //  TODO: replace with blue bird promise engine
      var promise =  new $.Deferred();

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

    var showRoomByName = function (roomName) {
      var room = chatData.rooms.getRoomByName(roomName);

      chatData.currentUser.changeRoom(
        room,
        function (response) {
          chatData.roomConversation.changeRoom(
            room,
            new ChatUsers(response.users),
            new Messages(response.lastMessages));

          chatApp.set('selectedConversation', chatData.roomConversation);

          scrollSelectedTab();
        },
        handleError);
    };

    var scrollSelectedTab = function () {
      var selectedTab = $('.tab-content.selected-tab');

      selectedTab.scrollTop(selectedTab.height())
    };

    var handleError = function (error) {
      alert(error);
    };

    chatApp.on({
      login: function (event) {
        if(event) {
          if(!loginForm.checkValidity())
              return;

          event.original.preventDefault();
        }

        chatData.currentUser.login(
          function (response) {
            chatApp.set('rooms', new Rooms(response.rooms));

            chatData.currentUser.on('newRoomMessage', function (messageData) { 
              chatData.roomConversation.addMessage(messageData);

              scrollSelectedTab();
            });

            chatData.currentUser.on('newPrivateMessage', function (messageData) {
              getUserById(messageData.userId)
                .then(function (user) {
                  chatData.userConversations.addMessage(user, messageData);

                  scrollSelectedTab();
                });
            });

            chatData.currentUser.on('joinedRoom', function (user) {
              chatData.roomConversation.addUser(user);
            });

            chatData.currentUser.on('leftRoom', function (userId) {
              chatData.roomConversation.removeUser(userId);
            });

            //  Enter first room
            showRoomByName(chatData.rooms.first().get('name'));
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

        showRoomByName(roomName);
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

    //  Initialize chat application
    if(chatData.currentUser.get('loggedIn') === 'true') {
      chatApp.fire('login');
    }
    else if(chatData.currentUser.get('loggedIn') === 'false') {
      $.getJSON('/getChatSnapshot')
        .done(function (snapshot) {
          chatApp.set('rooms', new Rooms(snapshot.rooms));

          chatData.roomConversation.changeRoom(
            new Room(snapshot.rooms[0]),
            new ChatUsers(snapshot.firstRoomUsers),
            new Messages(snapshot.firstRoomLastMessages));

          chatApp.set('selectedConversation', chatData.roomConversation);

          scrollSelectedTab();
        });
    }

    window.chatApp = chatApp;
    return chatApp;
  }
);