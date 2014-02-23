define(
  ['Backbone', 'models/baseUser', 'underscore', 'jquery' , 'socket.io', 'models/chatData'],
  function (Backbone, BaseUser, _ , $, io, chatData) {
    'use strict';

    var currentUser = BaseUser.extend({
      defaults: _.extend({
          saveUserInfo: false,
          loggedIn: false
        },
        BaseUser.prototype.defaults),

      initialize: function () {
        var self = this;

        //  TODO: should be handled with events - not async:false
        $.ajax({
          dataType: "json",
          url: '/isLoggedIn',
          data: null,
          async: false
        })
        .done(function (data) {
          self.loggedIn = data.loggedIn;

          self._socket = io.connect('http://localhost:3000');
        });
      },

      login: function (success, failed) {
        var self = this;
        var socket = this._socket;

        var profileJSON = this.loggedIn ? null : this.toJSON();

        socket.emit(
          'login',
          profileJSON,
          function (response) {
            if (failed && response.error) {
              failed(response.error);

              return;
            }

            self.set(response.userData);

            socket.on('newPrivateMessage', function (messageData) { self.trigger('newPrivateMessage', messageData); })
            socket.on('newRoomMessage', function (messageData) { self.trigger('newRoomMessage', messageData); })
            socket.on('joinedRoom', function (user) { self.trigger('joinedRoom', user); })
            socket.on('leftRoom', function (userId) { self.trigger('leftRoom', userId); })
            
            if(success)
              success(response);
          }
        );
      },

      //  TODO: move to RoomConversation
      changeRoom: function (room, success, failed) {
        this._socket.emit('changeRoom', room.get('id'), function (response) {  
          if(response && response.error) {
            failed(response.error);

            return;
          }
                  
          success(response);
        });
      },

      sendRoomMessage: function (messageText, failed) {
        this._socket.emit(
          'sendRoomMessage',
          messageText,
          function (response) {
            if(response.error)
              failed(response.error);
          });
      },

      sendPrivateMessage: function (userId, messageText, success, failed) {
        this._socket.emit(
          'sendPrivateMessage', 
          { toUserId: userId, text: messageText }, 
          function (response) {
            if(response && response.error) {
              failed(response.error);

              return;
            }

            success(response);
          });
      },

      getUserById: function (userId, success) {
        this._socket.emit('getUserById', userId, function (user) {
          success(user);
        });
      }
    });

    return currentUser;
  }
);