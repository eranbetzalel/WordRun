var _stats = {
  newConnections : 0,
  logins : 0,
  logouts : 0,
  loggedInUsers: {
    total: 0,
    rooms: []
  }
};

exports.newConnection = function() {
  _stats.newConnections++;
};

exports.login = function() {
  _stats.logins++;
};

exports.logout = function() {
  _stats.logouts++;
};