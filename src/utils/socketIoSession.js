exports.injectSession = function (ioServer, cookieParser, sessionStore, cookieName) {
  var _cookieName = cookieName || 'connect.sid';

  ioServer.set('authorization', function (handshake, accept) {
    if (!handshake || !handshake.headers || !handshake.headers.cookie)
      return accept('MISSING_COOKIE', false);

    cookieParser(handshake, {}, function(err) {
      if(err)
        return accept('COOKIE_PARSE_ERROR', false);

      var sessionId = 
        (handshake.secureCookies && handshake.secureCookies[_cookieName]) ||
        (handshake.signedCookies && handshake.signedCookies[_cookieName]) ||
        (handshake.cookies && handshake.cookies[_cookieName]);
      
      sessionStore.load(sessionId, function(err, session) {
        if(err || !session) {
          accept('NO_SESSION_FOUND', false);

          return;
        } 
                        
        handshake.session = session;

        accept(null, true);
      });
    });
  });
};