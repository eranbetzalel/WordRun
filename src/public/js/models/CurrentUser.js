define(
  ['Backbone', 'models/baseUser', 'underscore', 'socket.io', 'models/chatData'],
  function (Backbone, BaseUser, _ , io, chatData) {
    'use strict';

    var currentUser = BaseUser.extend({
      defaults: _.extend({
          saveUserInfo: false
        },
        BaseUser.prototype.defaults),

      initialize: function () {
        this._socket = null;
      },

      login: function (success, failed) {
        if(!this._socket)
          this._socket = io.connect('http://localhost:3000');

        var self = this;
        var socket = this._socket;

        socket.emit(
          'login',
          this.toJSON(),
          function (response) {
            if (failed && response.error) {
              failed(response.error);

              return;
            }
            
            socket.on('newPrivateMessage', function (message) { self.trigger('newPrivateMessage', message); })
            socket.on('newRoomMessage', function (message) { self.trigger('newRoomMessage', message); })
            
            if(success)
              success(response);
          }
        );
      },

      changeRoom: function (room, success, error) {
        this._socket.emit('changeRoom', room.get('name'), function (response) {  
          if(response.error) {
            error(response);

            return;
          }
                  
          success(response);
        });
      },

      sendRoomMessage: function (message) {
        this._socket.emit('sendRoomMessage', message);
      },

      sendPrivateMessage: function (user, message) {
        this._socket.emit('sendPrivateMessage', message);
      }
    });

    return currentUser;
  }
);