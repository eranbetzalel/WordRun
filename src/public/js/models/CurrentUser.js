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
            
            socket.on('newPrivateMessage', function (message) { self.trigger('newPrivateMessage', message); })
            socket.on('newRoomMessage', function (message) { self.trigger('newRoomMessage', message); })
            socket.on('joinedRoom', function (user) { self.trigger('joinedRoom', user); })
            socket.on('leftRoom', function (user) { self.trigger('leftRoom', user); })
            
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