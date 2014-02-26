define(
  ['moment', 'models/currentUser', 'models/chatUsers', 'models/rooms', 'models/roomConversation', 'models/userConversations'],
  function (moment, CurrentUser, ChatUsers, Rooms, RoomConversation, UserConversations) {
    'use strict';

    var chatData =  {
      currentUser: new CurrentUser(),
      rooms: new Rooms(),
      roomConversation: new RoomConversation(),
      userConversations: new UserConversations(),
      selectedConversation: null,

      showTime: function (date) {
        return moment(date).format('HH:mm:ss');
      }
    };

    return chatData;
  }
);