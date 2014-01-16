var User = function User(socket) {
  this.name = null;
  this.age = null;
  this.gender = null;

  this.socket = socket;
  socket.user = this;
}

User.prototype.__defineGetter__('id', function () {
  return this.name;
});

User.prototype.setProfile = function setProfile(userProfile, failed) {
  var error;

  if(!userProfile) {
    failed('Empty user profile');
    
    return false;
  }

  if(!userProfile.name) {
    failed('Missing username');

    return false;
  }

  this.name = userProfile.name;
  this.age = userProfile.age;
  this.gender = userProfile.gender;

  return true;
}

module.exports = User;