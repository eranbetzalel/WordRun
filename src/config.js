var config = {
  httpPort: parseInt(process.env.PORT, 10) || 3000,
  maxRoomLastMessages: 10,
  mainRoomName: 'Lobby',
  defaultRoomNames: [ 'Lobby', 'News', 'Football', '20+', '30+', '40+' ]
}

module.exports = config;