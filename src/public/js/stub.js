define(
  function () {
    'use strict';
    
    var stubUser = {};

    var stubRoom = { usersCount: 100 };

    var user1Conversation = {
      user: stubUser,
      activeConversation: true,
      messages: [
          { time: '11:22:00', userName: 'User 1', text: 'Testing messages...1' },
          { time: '11:22:00', userName: 'User 1', text: 'Testing messages...2' },
          { time: '11:22:00', userName: 'User 1', text: 'Testing messages...3' }
      ]
    };

    var stubData = {
      user: {
        isLoggedIn: false,
        profile: {
          name: 'Test',
          gender: '',
          age: ''
        }
      },
      users: {
        'User 1': stubUser,
        'User 2': {},
        'User 3': {},
        'User 4': {},
        'User 5': {}
      },
      rooms: {
        'Lobby': stubRoom,
        'Room1': { usersCount: 110 },
        'Room2': { usersCount: 120 }
      },
      selectedConversation: user1Conversation,
      roomConversation: {
        room: stubRoom,
        roomName: 'Lobby',
        messages: [
            { time: '11:22:00', userName: 'User1', text: 'Testing messages...1' },
            { time: '11:22:00', userName: 'User2', text: 'Testing messages...2' },
            { time: '11:22:00', userName: 'User3', text: 'Testing messages...3' }
        ]
      },
      userConversations: {
        'User 1': user1Conversation,
        'User 2': {
          user: stubUser,
          messages: [
              { time: '11:22:00', userName: 'User 2', text: 'Testing messages...1' },
              { time: '11:22:00', userName: 'User 2', text: 'Testing messages...2' },
              { time: '11:22:00', userName: 'User 2', text: 'Testing messages...3' }
          ]
        }
      }
    };

    return stubData;
  });