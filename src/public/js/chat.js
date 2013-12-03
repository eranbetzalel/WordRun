define(
  ['config', 'jquery', 'html5shiv', 'ractive', 'moment', 'socket.io', 'stub'],
  function (config, $, html5Shiv, ractive, moment, io, stubData) {
    'use strict';

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

            if(textToSend.value === '')
              return;

            var messages = this.data.selectedConversation.messages;

            if (messages.length > config.maxTextMessages)
              messages.splice(0, 1);

            messages.push(
              {
                time: moment().format('HH:mm:ss'),
                userName: this.data.user.profile.name,
                text: textToSend.value
              });

            textToSend.value = '';
          }
        });
      }
    });

    return new ChatApp();
  });