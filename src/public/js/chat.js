define(
  ['config', 'jquery', 'html5shiv', 'ractive', 'moment', 'socket.io', 'underscore'],
  function (config, $, html5Shiv, ractive, moment, io, _) {
    'use strict';

    var chatApp = function () {
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
              messageContainers: [
                {
                  name: 'לובי',
                  active: true,
                  pinned: true,
                  messages: [
                    { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
                    { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' },
                    { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' }
                  ]
                },
                {
                  name: 'משתמש 1',
                  messages: [
                    { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
                    { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
                    { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' }
                  ],
                },
                {
                  name: 'משתמש 2',
                  messages: [
                    { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' },
                    { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' },
                    { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' }
                  ],
                }
              ],
            },
          });

          this.mainView.on('tryLogin', function (event) {
            event.original.preventDefault();

            var socket = io.connect(window.location.href);

            socket.emit('login', this.get('user.profile'));

            $('.modal').fadeOut(150, function () {
              $('.modal-background').fadeOut(400);
            });
          });

          this.mainView.on('showMessageContainer', function (event) {
            var messageContainers = this.get('messageContainers');

            var activeMessageContainer = _.findWhere(messageContainers, { active: true});
            var activeMessageContainerIndex = _.indexOf(messageContainers, activeMessageContainer);

            this.set('messageContainers.' + activeMessageContainerIndex + '.active', false);
            this.set(event.keypath + '.active', true);
          });

          this.mainView.on('closeMessageContainer', function (event, index) {
            event.original.stopPropagation();
            
            if(event.context.active)
              this.set('messageContainers.' + (index - 1) + '.active', true);
            
            var messageContainers = this.get('messageContainers');

            messageContainers.splice(index, 1);
          });

          this.mainView.on('openPrivateMessage', function (event) {
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