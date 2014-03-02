var Promise = require('bluebird')
  , config = require('./config')
  , stats = require('./stats')
  , blueBirdUtil = require('./utils/blueBirdUtil.js')
  , mongoErrorResolver = require('./utils/mongoErrorResolver.js')
  , Message = require('./DTOs/message.js');

exports = module.exports = ChatController;

function ChatController(io, userStore, roomStore) {
  this._io = io;
  this._userStore = userStore;
  this._roomStore = roomStore;
}

ChatController.prototype.init = function () {
  var self = this;

  setInterval(removeLoggedOutUsers, 10 * 1000, this._userStore);

  this._io.sockets.on('connection', function (socket) {
    self.onConnection(socket);
  });

  var roomAddSequence = Promise.resolve();

  var nowMilli = Date.now();

  config.defaultRoomNames.forEach(function (roomName, index) {
    var roomData = {
      name: roomName,
      isPermanent: true,
      lastMessages: [],
      createdAt: nowMilli + index
    };

    roomAddSequence = 
      roomAddSequence.then(function () {
        return self._roomStore.addRoom(roomData);
      });
  });

  return roomAddSequence;
}

ChatController.prototype.onConnection = function (socket) {
  var self = this;

  socket.on('login', function (userProfile, responseCallback) {
     self.onUserLogin(this, userProfile, responseCallback);
  });

  socket.on('disconnect', function () {
     self.onDisconnect(this);
  });

  stats.newConnection();
}

ChatController.prototype.onDisconnect = function (socket) {
  var currentUserId = socket.handshake.session.userId;
  
  if(!currentUserId)
    return;

  var self = this;

  this._userStore.getUserById(currentUserId)
    .then(function (user) {
      var userRoomId = user.room.toJSON()

      socket.broadcast.to(userRoomId).emit('leftRoom', currentUserId);

      return self._userStore.updateUser(
        currentUserId, { loggedOutAt: Date.now(), socketId: null });
    })
    .then(stats.logout)
    .catch(function (err) {
      console.log(err.stack);
    });
}

ChatController.prototype.onUserLogin = function (socket, loginUserData, responseCallback) {
  var userDbPromise;
  var currentSession = socket.handshake.session;

  var self = this;

  new Promise(function (resolve, reject) {
    if(!loginUserData && currentSession.userId) {
      //  Continue with current user ID
      self._userStore
        .getUserById(currentSession.userId)
        .then(function (user) {
          if(!user) {
            currentSession.destroy();

            reject('Invalid user ID.');
          }
          else {
            resolve(user.id);
          }
        }, reject);
    }
    else {
      //  Adds new user
      self._userStore
        .addUser(loginUserData)
        .then(function (user) {
          //  Save user info to session
          currentSession.userId = user.id;
          
          currentSession.save(function () {
            resolve(user.id);
          });
        }, reject);
    }
  })
  .then(function (userId) {
    //  Register to user socket events
    socket.on('changeRoom', function (roomName, responseCallback) {
      self.onUserChangeRoom(this, roomName, responseCallback);
    });

    socket.on('sendPrivateMessage', function (messageData, responseCallback) {
      self.onUserSendPrivateMessage(this, messageData.toUserId, messageData.text, responseCallback);
    });

    socket.on('sendRoomMessage', function (messageText, responseCallback) {
      self.onUserSendRoomMessage(this, messageText, responseCallback);
    });

    socket.on('getUserById', function (userId, responseCallback) {
      self.onGetUserById(this, userId, responseCallback);
    });

    return Promise.all([
      self._userStore.updateUser(
        userId, { loggedInAt: Date.now(), loggedOutAt: null, socketId: socket.id }),
      self._roomStore.getRooms()]);
  })
  .spread(function (user, rooms) {
    responseCallback({
      userData: user.toDTO(),
      rooms: rooms.map(function (room) { return room.toDTO(); })
    });

    stats.login();
  })
  .catch(function (err) {
    //  TODO: should use mongoErrorResolver only in data stores
    if(mongoErrorResolver.isDuplicateRecordError(err)) {
      responseCallback({ error: 'User already exists.' });

      return;
    }

    console.log(err.stack);

    responseCallback({ error: 'Could not perform login.' });
  });
}

ChatController.prototype.onUserChangeRoom = function (socket, roomId, responseCallback) {
  var self = this;
  var currentUserId = socket.handshake.session.userId;

  this._userStore.getUserById(currentUserId)
    .then(function (user) {
      var oldRoomId = !user.room ? null : user.room.toJSON();

      return Promise.all([
        self._userStore.userSwitchRoom(currentUserId, roomId),
        oldRoomId,
        self._roomStore.getRoomById(roomId),
        self._userStore.getOnlineUsersByRoomId(roomId)]);
    })
    .spread(function (user, oldRoomId, newRoom, newRoomUsers) {
      if(oldRoomId) {
        socket.leave(oldRoomId);
        socket.broadcast.to(oldRoomId).emit('leftRoom', user.id);
      }

      socket.join(newRoom.id);
      socket.broadcast.to(newRoom.id).emit('joinedRoom', user.toDTO());

      responseCallback({
        users: newRoomUsers.map(function (user) { return user.toDTO(); }),
        lastMessages: newRoom.lastMessages
      });
    })
    .catch(function (err) {
      console.log(err.stack);

      responseCallback({ error: 'Could not change room.' });
    });
}

ChatController.prototype.onUserSendPrivateMessage = function (socket, toUserId, messageText, responseCallback) {
  var self = this;
  var currentUserId = socket.handshake.session.userId;

  Promise.all([
    this._userStore.getUserById(currentUserId),
    this._userStore.getUserById(toUserId)])
    .spread(function (sourceUser, destinationUser) {
      if(!sourceUser) {
        responseCallback({ error: 'Could not find source user.' });

        return;
      }

      if(!destinationUser) {
        responseCallback({ error: 'Could not find destination user.' });

        return;
      }
  
      var messageData = new Message({
        userId: sourceUser.id,
        userName: sourceUser.name,
        text: messageText,
        sentAt: Date.now()
      });

      self._io.sockets.socket(destinationUser.socketId).emit('newPrivateMessage', messageData);

      responseCallback();
    })
    .catch(function (err) {
      console.log(err.stack);

      responseCallback({ error: 'Could not send message.' });
    });
}

ChatController.prototype.onUserSendRoomMessage = function (socket, messageText, responseCallback) {
  var currentUserId = socket.handshake.session.userId;
  
  var self = this;

  this._userStore.getUserById(currentUserId)
    .then(function (user) {
      if(!user) {
        responseCallback({ error: 'Could not find user.' });

        return;
      }

      var messageData = new Message({
        userId: user.id,
        userName: user.name,
        text: messageText,
        sentAt: Date.now()
      });

      var roomId = user.room.toJSON();

      self._io.sockets.in(roomId).emit('newRoomMessage', messageData);

      self._roomStore.addRoomMessage(roomId, messageData);
    })
    .catch(function (err) {
      responseCallback({ error: 'Could not send message.' });
    });
}

ChatController.prototype.onGetUserById = function (socket, userId, responseCallback) {
  this._userStore.getUserById(userId)
    .then(function (user) {
      responseCallback(user);
    });
}

ChatController.prototype.isUserLoggedIn = function (req, res) {
  var userId = req.session.userId;

  if(!userId)
    return res.json({ loggedIn: false });

  this._userStore
    .getUserById(userId)
    .then(function (user) {
      res.json({
        loggedIn: user != null && user.loggedInAt != null
      });
    })
    .catch(function (err) {
      console.log(err.stack);
    });
}

ChatController.prototype.getChatSnapshot = function (req, res) {
  var self = this;

  this._roomStore.getRooms()
    .then(function(rooms) {
      var firstRoom = rooms[0];

      return Promise.all([
        rooms,
        firstRoom,
        self._userStore.getOnlineUsersByRoomId(firstRoom.id)]);
    })
    .spread(function(rooms, firstRoom, firstRoomUsers) {
      var firstRoomDTO = firstRoom.toDTOWithMessages();

      res.json({
        rooms: rooms.map(function (room) { return room.toDTO(); }),
        firstRoomUsers: firstRoomUsers.map(function (user) { return user.toDTO(); }),
        firstRoomLastMessages: firstRoom.toDTOWithMessages().lastMessages
      });
    })
    .catch(function (err) {
      console.log(err.stack);
    });
}

function removeLoggedOutUsers(userStore) {
  var now = Date.now();

  userStore
    .getLoggedOutUsers()
    .then(function (users) {
      users.forEach(function (user) {
        if(!user.loggedOutAt)
          return;
    
        var loggedOutPeriod = Math.abs(now - user.loggedOutAt);

        if(loggedOutPeriod >= config.disconnectedUserGracePeriod)
          userStore.removeUser(user.id);
      });
    });
}