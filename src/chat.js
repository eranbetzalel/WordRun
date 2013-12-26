var _rooms = require('./rooms.js'),
    _users = require('./users.js');

exports.init = function (io) {
  _rooms.init(io);
  _users.init(io);
};