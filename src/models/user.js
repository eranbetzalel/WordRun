var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var userSchema = new Schema({
  name: { type: String, required: true, index: { unique: true, dropDups: true } },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  loggedInAt: { type: Date },
  loggedOutAt: { type: Date },
  room: { type: ObjectId, ref: 'Room' },
  socketId: { type: String }
});

userSchema.methods.toDTO = function () {
  return {
    id : this.id,
    name : this.name,
    age : this.age,
    gender : this.gender
  };
}

module.exports = mongoose.model('User', userSchema);