var mongoose = require('mongoose')
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

module.exports = mongoose.model('Room', roomSchema);