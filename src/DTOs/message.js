exports = module.exports = Message;

function Message(messageData) {
  this.userId = messageData.userId;
  this.userName = messageData.userName;
  this.text = messageData.text;
  this.sentAt = messageData.sentAt;
}