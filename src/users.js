var _ = require('underscore')
  , config = require('./config')
  , stats = require('./stats')
  , Rooms = require('./rooms')
  , User = require('./user');

exports = module.exports = Users;

function Users(io) {
  this._io = io;
  this._users = {};
  this._rooms = new Rooms();

  var self = this;

  setInterval(this.removeLoggedOutUsers, 10 * 1000);

  this._io.sockets.on('connection', function (socket) {
    self.onConnection(socket);
  });
}

Users.prototype.getUserNames = function () {
  return _.keys(this._users);
}

Users.prototype.getUser = function (userName) {
  return this._users[userName];
}

Users.prototype.addUser = function (user) {
  this._users[user.id] = user;
}

Users.prototype.removeUser = function (userId) {
  delete this._users[userId];
}

Users.prototype.removeLoggedOutUsers = function () {
  var now = new Date();

  var self = this;

  _.each(this._users, function (user) {
    if(!user.loggedOutAt)
      return;
    
    var loggedOutPeriod = Math.abs(now - user.loggedOutAt);

    if(loggedOutPeriod >= config.disconnectedUserGracePeriod)
      self.removeUser(user.id);
  });
}

Users.prototype.onConnection = function (socket) {
  var self = this;

  socket.on('login', function (userProfile, responseCallback) {
     self.onUserLogin(this, userProfile, responseCallback);
  });

  socket.on('disconnect', function () {
     self.onDisconnect(this);
  });

  stats.newConnection();
}

Users.prototype.onDisconnect = function (socket) {
  if(socket.user)
    socket.user.loggedOutAt = new Date();

  stats.logout();
}

Users.prototype.onUserLogin = function (socket, userProfile, responseCallback) {
  var user;

  if(!userProfile && socket.handshake.session.userId) {
    //  Pulls existing user data from session
    user = this._users[socket.handshake.session.userId];

    user.loggedOutAt = null;
  }
  else {
    user = new User();

    if(!user.setProfile(
      userProfile, function (error) { responseCallback({error: error}); }))
      return;

    this.addUser(user);
  }

  user.setSocket(socket);

  var self = this;

  //  Register to user socket events
  socket.on('changeRoom', function (roomName, responseCallback) {
    self.onUserChangeRoom(this, roomName, responseCallback);
  });

  socket.on('sendPrivateMessage', function (privateMessage) {
    self.onUserSendPrivateMessage(privateMessage);
  });

  socket.on('sendRoomMessage', function (messageText) {
    self.onUserSendRoomMessage(this, messageText);
  });

  //  User joins the main room
  var userRoom = this._rooms.userJoinRoom(user, config.mainRoomName);

  //  Save user info to session
  socket.handshake.session.userId = user.id;
  socket.handshake.session.save();

  user.loggedInAt = new Date();

  responseCallback({ 
    userRoom: {
      name: userRoom.name,
      lastMessages: userRoom.lastMessages
    },
    userNames: this.getUserNames(),
    roomNames: this._rooms.getRoomNames()
  });

  stats.login();
}

Users.prototype.onUserChangeRoom = function (socket, roomName, responseCallback) {
  var room = this._rooms.getRoom(roomName);

  if(!room) {
    responseCallback({
      error: 'Could not find room.'
    });

    return;
  }

  this._rooms.userJoinRoom(socket.user, roomName);

  responseCallback({
    userNames: room.getUserNames(),
    lastMessages: room.lastMessages
  });
}

Users.prototype.onUserSendPrivateMessage = function (privateMessage) {
  var user = this.getUser(privateMessage.userName);

  if(!user) {
    console.log('Could not find user ' + privateMessage.userName + '.');

    return;
  }
  
  user.socket.emit('newPrivateMessage', privateMessage);
}

Users.prototype.onUserSendRoomMessage = function (socket, messageText) {
  var user = socket.user;
  var userRoom = this._rooms.getUserRoom(user);

  var message = {
    userName: user.name,
    message: messageText
  };

  this._io.sockets.in(userRoom.name).emit('newRoomMessage', message);

  var lastMessages = userRoom.lastMessages;

  if (lastMessages.length > config.maxRoomLastMessages)
    lastMessages.shift();

  lastMessages.push(message);
}