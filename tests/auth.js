var lib = require('./lib');

describe('api/auth.js', function() {
  lib.setUp();
  this.timeout(5000);

  describe('login', function() {
    it('fails to log in with invalid username and password', function(done) {
      lib.request()
        .post('/login')
        .send({
          username: 'testuser',
          password: 'WRONGtestpass'
        })
        .expect(403, done);
    });

    it('logs in successfully with valid username and password', function(done) {
      lib.request()
        .post('/login')
        .send({
          username: 'testuser',
          password: 'testpass'
        })
        .expect(200, done);
    });
  });

  describe('logout', function() {
    it('successfully logs a user out', function(done) {
      // use an agent to persist cookies
      var agent = lib.request();
      // log in
      agent.post('/login')
        .send({
          username: 'testuser',
          password: 'testpass'
        })
        .end(function() {
          // then log out
          agent.get('/logout')
            .expect(302)             // redirected...
            .expect('Location', '/') // ...to the index
            .end(done);
        });
    });

  });
});

