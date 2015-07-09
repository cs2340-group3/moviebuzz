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

  describe('updateProfile', function() {
    it('fails to update the profile when sent null', function(done) {
      this.agent
        .put('/profile')
        .expect(400, done);
    });

    it('fails to update the profile when sent an invalid field', function(done) {
      this.agent
        .put('/profile')
        .send({
          failure: 'should not work'
        })
        .expect(400, done);
    });

    it('updates profile with valid input for valid bio field', function(done) {
      this.agent
        .put('/profile')
        .send({
          name: 'bio',
          value: 'newBio'
        })
        .expect(200, done);
    });

    it('updates profile with valid input for valid firstname field', function(done) {
      this.agent
        .put('/profile')
        .send({
          name: 'firstname',
          value: 'Joe'
        })
        .expect(200, done);
    });

    it('updates profile with valid input for valid lastname field', function(done) {
      this.agent
        .put('/profile')
        .send({
          name: 'lastname',
          value: 'Smith'
        })
        .expect(200, done);
    });

    it('updates profile with valid input for valid major field', function(done) {
      this.agent
        .put('/profile')
        .send({
          name: 'major',
          value: 'Computer Science'
        })
        .expect(200, done);
    });
  });
});

