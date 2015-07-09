var lib = require('./lib');

describe('api/profile.js', function() {
  lib.setUp();
  this.timeout(5000);

  lib.loginBeforeEach();

  describe('profile', function() {
    it('should display username and editing fields', function(done) {
      this.agent
        .get('/profile')
        .expect(200)
        .expect(/Username: testuser/g)
        .expect(/Email: testuser@example.com/g)
        .expect(/Your personal bio:/g, done);
    });
  });
});
