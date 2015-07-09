// set test environment
process.env.NODE_ENV = 'test';

var app = require('../app');
var supertest = require('supertest');
var User = require('../models/user');

exports.request = function() {
  return supertest.agent('localhost:3001');
};

exports.setUp = function() {
  var USER = { username: 'testuser', email: 'testuser@example.com' };
  var PASSWORD = 'testpass';

  beforeEach(function(done) {
    User.remove({ username: 'testuser' }, function() {
      User.register(USER, PASSWORD, done);
    });
  });

  afterEach(function(done) {
    User.remove({ username: 'testuser' }, done);
  });

  beforeEach(function(done) {
    this.server = app.listen(3001, done);
  });

  afterEach(function() {
    this.server.close();
  });

};

