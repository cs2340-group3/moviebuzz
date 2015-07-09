var lib = require('./lib');

describe('api/auth.js', function() {
  lib.setUp();
  this.timeout(5000);

  describe('register', function() {
    it('fails register with incorrect username, but with valid email and password', function(done) {
      lib.request()
        .post('/register')
        .send({
          username: 'er#%dj!!',
          email: 'usertest@gmail.com',
          password: '123456'
        })
        .expect(403, done);
    });

    it('fails register with incorrect email, but with valid username and password', function(done) {
      lib.request()
        .post('/register')
        .send({
          username: 'userT',
          email: '123djp',
          password: '123456'
        })
        .expect(403, done);
    });

    it('fails register with incorrect password length, but with valid username and email', 
      function(done) {
      lib.request()
        .post('/register')
        .send({
          username: 'userT',
          email: 'ttt@gmail.com',
          password: '123'
        })
        .expect(403, done);
    });

    it('fails register with pre-exisitng email address, but with valid username and password', 
      function(done) {
      lib.request()
        .post('/register')
        .send({
          username: 'userT2',
          email: 'testuser@example.com',
          password: '123456'
        })
        .expect(403, done);
    });

    it('fails register with no email address, but with valid username and password', 
      function(done) {
      lib.request()
        .post('/register')
        .send({
          username: 'userT2',
          email: '',
          password: '123456'
        })
        .expect(403, done);
    });

    it('fails register with no username, but with valid email and password', function(done) {
      lib.request()
        .post('/register')
        .send({
          username: '',
          email: 'gg@@gmail.com',
          password: '123456'
        })
        .expect(403, done);
    });
    it('fails register with no password, but with valid email and username', function(done) {
      lib.request()
        .post('/register')
        .send({
          username: 'rtesksi12',
          email: 'gg@@gmail.com',
          password: ''
        })
        .expect(403, done);
    });

    it('register successfully with valid username, email, and password', function(done) {
      lib.request()
        .post('/register')
        .send({
          username: 'megan',
          email: 'megan@gmail.com',
          password: '123456'
        })
        .expect(200, done);
    });
  });
});
