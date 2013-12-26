define(
  ['config', 'jquery', 'html5shiv', 'ractive', 'moment', 'socket.io', 'stub'],
  function (config, $, html5Shiv, ractive, moment, io, stubData) {
    'use strict';

    var ChatApp = ractive.extend({
      el: 'chatApp',
      template: '#chatAppTemplate',
      init: initChatApp,
      data: {
        getValidAges: function () {
          var ages = [];

          for (var i = config.minValidAge; i <= config.maxValidAge; i++) {
              ages.push(i);
          }

          return ages;
        }
      }
    });

    return new ChatApp();
  });

function initChatApp() {
  this.on({
    tryLogin: function (event) {
      event.original.preventDefault();

      this._socket = io.connect('http://localhost:3000');

      var self = this;

      this._socket.emit('login', this.get('user.profile'), function (response) {
        if(response.error) {
          alert(response.error);

          return;
        }

        self.set('users', response.userNames);
        self.set('rooms', response.roomNames);

        initRoomConversation.call(
          self, response.userRoom.name, response.userRoom.lastMessages);

        $('.modal').fadeOut(150, function () {
          $('.modal-background').fadeOut(400);
        });
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
      this._socket.emit('changeRoom', roomName, function (roomName) {
        initRoomConversation(roomName);

        this.set('selectedConversation', newRoomConversation);
      });
    },

    sendMessage: function (event) {
      event.original.preventDefault();

      if(textToSend.value === '')
        return;

      var message = {
        destUsername: '',
        text: ''
      };

      var messageType = 'privateMessage';

      if(this.data.selectedConversation === this.data.roomConversation) {
        messageType = 'roomMessage'
      }
      else {
        message.destUsername = this.get('selectedConversation.userName');
      }

      this._socket.emit(messageType, message);

      var messages = this.data.selectedConversation.messages;

      if (messages.length > config.maxTextMessages)
        messages.shift();

      messages.push({
        time: moment().format('HH:mm:ss'),
        userName: this.data.user.profile.name,
        text: textToSend.value
      });

      textToSend.value = '';
    }
  });
}

function initRoomConversation(roomName, lastMessages) {
  var newRoomConversation = {
    room: this.get('rooms.' + roomName),
    messages: lastMessages
  };

  this.set('roomConversation', newRoomConversation);
}