define(
  ['config', 'jquery', 'html5shiv', 'ractive', 'moment', 'socket.io'],
  function (config, $, html5Shiv, ractive, moment, io) {
    'use strict';

    var chatApp = function () {
      var _modal;

      return {
        init: function () {
          //  Initialize RActive
          this.mainView = new ractive({
            el: 'chatApp',
            template: '#chatAppTemplate',
            noIntro: true,
            data: {
              user: {
                profile: {
                  nick: '',
                  gender: '',
                  age: ''
                },
                isLoggedIn: false
              },
              users: [
                { name: 'משתמש 1' },
                { name: 'משתמש 2' },
                { name: 'משתמש 3' }
              ],
              rooms: [
                { name: 'חדר 1' },
                { name: 'חדר 2' },
                { name: 'חדר 3' }
              ],
              messages: [
                { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
                { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
                { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
                { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
                { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' }
              ]
            }
          });

          this.mainView.on('tryLogin', function (event) {
            event.original.preventDefault();

            var socket = io.connect(window.location.href);

            socket.emit('login', this.get('user.profile'));

            $('.modal').fadeOut(150, function () {
              $('.modal-background').fadeOut(400);
            });
          });

          this.mainView.on('showRoom', function (event) {
            event.original.preventDefault();
          });

          this.mainView.on('showUserPrivateMessage', function (event) {
            event.original.preventDefault();
          });

          this.mainView.on('sendMessage', function (event) {
            event.original.preventDefault();

            var messages = this.get('messages');

            if (messages.length > config.maxTextMessages)
              messages.splice(0, 1);

            messages.push(
              {
                time: new Date(),
                userName: this.get('user.name'),
                text: textToSend.value
              });

            textToSend.value = '';
          });
        }
      };
    }

    return chatApp();
  });