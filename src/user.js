exports = module.exports = User;

function User() {
  this.name = null;
  this.age = null;
  this.gender = null;
}

User.prototype.__defineGetter__('id', function () {
  return this.name;
});

User.prototype.setProfile = function (userProfile, failed) {
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

User.prototype.toJSON = function () {
  return {
      id : this.id,
      name : this.name,
      age : this.age,
      gender : this.gender
    };
}

User.prototype.setSocket = function (socket) {
  this.socket = socket;
  socket.user = this;
}