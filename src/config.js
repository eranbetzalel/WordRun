var config = {
  httpPort: parseInt(process.env.PORT, 10) || 3000,
  maxRoomLastMessages: 20,
  defaultRoomNames: [ 'Lobby', 'News', 'Football', '20+', '30+', '40+' ],
  sessionSecret: 'DefaultSecret',
  disconnectedUserGracePeriod: 5 * 60 * 1000,
  redisStore: {
    host: '',
    port: 0,
    pass: '',
    db: ''
  },
  mongoDbUri: ''
}

module.exports = config;