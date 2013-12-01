define(
  ['config', 'jquery', 'html5shiv', 'ractive', 'moment', 'socket.io'],
  function (config, $, html5Shiv, ractive, moment, io) {
    'use strict';

    var stubUser = {};

    var stubRoom = { usersCount: 100 };

    var user1Conversation = {
      user: stubUser,
      activeConversation: true,
      messages: [
          { time: '11:22:00', userName: 'User 1', text: 'Testing messages...1' },
          { time: '11:22:00', userName: 'User 1', text: 'Testing messages...2' },
          { time: '11:22:00', userName: 'User 1', text: 'Testing messages...3' }
      ]
    };

    var stubData = {
      user: {
        isLoggedIn: false,
        profile: {
          nick: '',
          gender: '',
          age: ''
        }
      },
      users: {
        'User 1': stubUser,
        'User 2': {},
        'User 3': {},
        'User 4': {},
        'User 5': {}
      },
      rooms: {
        'Lobby': stubRoom,
        'Room1': { usersCount: 110 },
        'Room2': { usersCount: 120 }
      },
      selectedConversation: user1Conversation,
      roomConversation: {
        room: stubRoom,
        roomName: 'Lobby',
        messages: [
            { time: '11:22:00', userName: 'User1', text: 'Testing messages...1' },
            { time: '11:22:00', userName: 'User2', text: 'Testing messages...2' },
            { time: '11:22:00', userName: 'User3', text: 'Testing messages...3' }
        ]
      },
      userConversations: {
        'User 1': user1Conversation,
        'User 2': {
          user: stubUser,
          messages: [
              { time: '11:22:00', userName: 'User 2', text: 'Testing messages...1' },
              { time: '11:22:00', userName: 'User 2', text: 'Testing messages...2' },
              { time: '11:22:00', userName: 'User 2', text: 'Testing messages...3' }
          ]
        }
      }
    };

    var ChatApp = ractive.extend({
      el: 'chatApp',
      template: '#chatAppTemplate',
      data: stubData,
      init: function () {
        this.on({
          tryLogin: function (event) {
            event.original.preventDefault();

            var socket = io.connect(window.location.href);

            socket.emit('login', this.get('user.profile'));

            $('.modal').fadeOut(150, function () {
              $('.modal-background').fadeOut(400);
            });
          },
          showRoomConversation: function (event) {
            this.set('selectedConversation', this.data.roomConversation);
          },
          showUserConversation: function (event, userName) {
            this.set('userConversations.' + userName + '.activeConversation', true);
            this.set('selectedConversation', this.get('userConversations.' + userName));
          },
          openUserConversation: function (event, userName) {
            var userConversation = this.get('userConversations.' + userName);

            if (this.data.selectedConversation === userConversation)
              return;

            if (userConversation === undefined) {
              this.set('userConversations.' + userName,
                {
                  user: this.get('users.' + userName),
                  messages: [
                      { time: '11:22:00', userName: userName, text: 'Testing messages...1' },
                      { time: '11:22:00', userName: userName, text: 'Testing messages...2' },
                      { time: '11:22:00', userName: userName, text: 'Testing messages...3' }
                  ]
                });
            }

            this.fire('showUserConversation', event, userName);
          },
          closeUserConversation: function (event, userName) {
            event.original.stopPropagation();

            var userConversation = this.get('userConversations.' + userName);

            if (this.data.selectedConversation === userConversation)
              this.fire('showRoomConversation');

            this.set('userConversations.' + userName + '.activeConversation', false);
          },
          openRoomConversation: function (event, roomName) {
            var newRoomConversation = {
              room: this.get('rooms.' + roomName),
              roomName: roomName,
              messages: [
                  { time: '11:22:00', userName: 'User1', text: 'Testing messages...1' },
                  { time: '11:22:00', userName: 'User2', text: 'Testing messages...2' },
                  { time: '11:22:00', userName: 'User2', text: 'Testing messages...2' },
                  { time: '11:22:00', userName: 'User2', text: 'Testing messages...2' },
                  { time: '11:22:00', userName: 'User3', text: 'Testing messages...3' }
              ]
            }

            this.set('roomConversation', newRoomConversation);
            this.set('selectedConversation', newRoomConversation);
          },
          sendMessage: function (event) {
            event.original.preventDefault();

            var messages = this.data.selectedConversation.messages;

            if (messages.length > config.maxTextMessages)
              messages.splice(0, 1);

            messages.push(
              {
                time: new Date(),
                userName: this.data.user.name,
                text: textToSend.value
              });

            textToSend.value = '';
          }
        });
      }
    });

    return new ChatApp();
  });