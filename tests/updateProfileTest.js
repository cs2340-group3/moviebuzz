var lib = require('./lib');

describe('api/profile.js', function() {
  lib.setUp();
  this.timeout(5000);

  describe('updateProfile', function() {
    it('fails to update the profile when sent null', function(done) {
      lib.request()
        .put('/profile')
        .expect(400, done);
    });

    it('fails to update the profile when sent an invalid field', function(done) {
      lib.request()
        .put('/profile')
        .send({
          failure: 'should not work'
        })
        .expect(400, done);
    });

    it('updates profile with valid input for valid fields', function(done) {
      lib.request()
        .put('/profile')
        .send({
          bio: 'newBio',
          firstname: 'Joe',
          lastname: 'Smith',
          major: 'Computer Science'
        })
        .expect(200, done);
    });
  });
});