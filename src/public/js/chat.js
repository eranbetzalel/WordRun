﻿define(
  ['config', 'jquery', 'html5shiv', 'ractive', 'moment', 'socket.io', 'underscore'],
  function (config, $, html5Shiv, ractive, moment, io, _) {
    'use strict';

    var stubData = {
      user: {
        profile: {
          nick: '',
          gender: '',
          age: ''
        },
        isLoggedIn: false
      },
      users: [
        { id: 1, name: 'משתמש 1' },
        { id: 2, name: 'משתמש 2' },
        { id: 3, name: 'משתמש 3' }
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
          userId: 1,
          name: 'משתמש 1',
          messages: [
            { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
            { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' },
            { time: '11:22:00', userName: 'משתמש 1', text: 'בדיקה... בדיקה... 123' }
          ],
        },
        {
          userId: 2,
          name: 'משתמש 2',
          messages: [
            { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' },
            { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' },
            { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' }
          ],
        }
      ],
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
          showMessageContainer: function (event) {
            var messageContainers = this.get('messageContainers');

            var activeMessageContainer = _.findWhere(messageContainers, { active: true });
            var activeMessageContainerIndex = _.indexOf(messageContainers, activeMessageContainer);

            this.set('messageContainers.' + activeMessageContainerIndex + '.active', false);
            this.set(event.keypath + '.active', true);
          },
          closeMessageContainer: function (event, index) {
            event.original.stopPropagation();

            if (event.context.active)
              this.set('messageContainers.' + (index - 1) + '.active', true);

            var messageContainers = this.get('messageContainers');

            messageContainers.splice(index, 1);
          },
          changeRoom: function (event) { },
          openPrivateMessage: function (event, userId) {
            var messageContainers = this.get('messageContainers');

            var userMessageContainer = _.findWhere(messageContainers, { userId: userId });

            if (userMessageContainer == undefined) {
              var activeMessageContainer = _.findWhere(messageContainers, { active: true });
              var activeMessageContainerIndex = _.indexOf(messageContainers, activeMessageContainer);
              this.set('messageContainers.' + activeMessageContainerIndex + '.active', false);

              messageContainers.push({
                userId: userId,
                name: '',
                active: true,
                messages: [
                  { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' },
                  { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' },
                  { time: '11:22:00', userName: 'משתמש 2', text: 'בדיקה... בדיקה... 123' }
                ],
              });

              var userMessageContainerIndex = _.indexOf(messageContainers, userMessageContainer);

              this.set('messageContainers.' + userMessageContainerIndex + '.active', true);

              return;
            }

            if (!userMessageContainer.active) {
              var activeMessageContainer = _.findWhere(messageContainers, { active: true });
              var activeMessageContainerIndex = _.indexOf(messageContainers, activeMessageContainer);
              this.set('messageContainers.' + activeMessageContainerIndex + '.active', false);

              var userMessageContainerIndex = _.indexOf(messageContainers, userMessageContainer);

              this.set('messageContainers.' + userMessageContainerIndex + '.active', true);
            }
          },
          sendMessage: function (event) {
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
          }
        });
      }
    });

    return new ChatApp();
  });