define(
  ['models/currentUser', 'models/chatUsers', 'models/rooms', 'models/roomConversation', 'models/userConversations'],
  function (CurrentUser, ChatUsers, Rooms, RoomConversation, UserConversations) {
    'use strict';

    var chatData =  {
      currentUser: new CurrentUser(),
      rooms: new Rooms(),
      roomConversation: new RoomConversation(),
      userConversations: new UserConversations(),
      selectedConversation: null,

      getValidAges: function () {
        var ages = [];

        for (var i = config.minValidAge; i <= config.maxValidAge; i++) {
          ages.push(i);
        }

        return ages;
      }
    };

    return chatData;
  }
);