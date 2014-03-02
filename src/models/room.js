var mongoose = require('mongoose')
  , Message = require('../DTOs/message.js')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;
 
var roomSchema = new Schema({
  name: { type: String, required: true, index: { unique: true, dropDups: true } },
  description: { type: String },
  isPermanent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastMessages: [{ 
    userId: { type: ObjectId, ref: 'User' },
    userName: String,
    text: String,
    sentAt: Date 
  }]
});

roomSchema.methods.toDTO = function () {
  return {
    id : this.id,
    name : this.name,
    description : this.description
  };
}

roomSchema.methods.toDTOWithMessages = function () {
  var dto = this.toDTO();

  dto.lastMessages =
    this.lastMessages.map(function (message) { return new Message(message); });

  return dto;
}

module.exports = mongoose.model('Room', roomSchema);