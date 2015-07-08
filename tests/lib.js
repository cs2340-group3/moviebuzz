// set test environment
process.env.NODE_ENV = 'test';

var assert = require('assert');
var Browser = require('zombie');

var app = require('../app');
var User = require('../models/user');

exports.setUp = function() {
  before(function(done) {
    this.server = app.listen(3001);
    this.browser = new Browser({ site: 'http://localhost:3001' });

    User.remove(function() {
      User.register({ username: 'user', email: 'user@example.com' }, 'pass', done);
    });
  });

  after(function(done) {
    User.remove();

    this.server.close(done);
  });
};

exports.login = function(browser, username, password) {
  return browser.visit('/login').then(function() {
    return browser
      .fill('Username', username || 'user')
      .fill('Password', password || 'pass')
      .pressButton('Submit');
  });
};

exports.assertTextContains = function(browser, selector, expected, message) {
  var elements = browser.queryAll(selector);
  assert(elements.length,
    'Expected selector \'' + selector + '\' to return one or more elements');
  var actual = elements.map(function(elem) {
    return elem.textContent;
  }).join('').trim().replace(/\s+/g, ' ');
  message = message || 'Expected \'' + actual + '\' to contain \'' + expected + '\'';
  assert(actual.indexOf(expected) >= 0, message);
};

