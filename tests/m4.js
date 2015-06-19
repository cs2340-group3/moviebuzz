var lib = require('./lib');
var assert = require('assert');

describe('M4 functionality', function() {
  lib.setUp();

  // make browser available in closure
  var browser;
  before(function() { browser = this.browser; });

  describe('registration screen', function() {
    beforeEach(function(done) {
      browser.deleteCookies();
      browser.visit('/register', done);
    });

    it.skip('should display username, email, and password inputs', function() {
      browser.assert.element('form input[name=username]');
      browser.assert.element('form input[name=email]');
      browser.assert.element('form input[name=password]');
      browser.assert.element('form input[name=confirmPassword]');
    });

    it.skip('should accept registration of a new user', function() {
      this.timeout(5000);
      return browser
        .fill('username', 'newuser')
        .fill('email', 'newemail@example.com')
        .fill('password', 'newpassword')
        .fill('confirmPassword', 'newpassword')
        .pressButton('Submit')
        .then(function() {
          assert(browser.link('Log out'));
        });
    });

    it.skip('should permit cancelling', function() {
      assert(browser.link('Cancel'));
    });
  });

  describe('profile page', function() {
    beforeEach(function() {
      browser.deleteCookies();
      return lib.login(browser)
        .then(function() {
          return browser.visit('/profile');
        });
    });

    it.skip('should show an initial profile', function() {
      lib.assertTextContains(browser, 'body', ' Username: user ');
      lib.assertTextContains(browser, 'body', ' Email: user@example.com ');
      lib.assertTextContains(browser, 'body', ' Your first name: Empty ');
      lib.assertTextContains(browser, 'body', ' Your last name: Empty ');
      lib.assertTextContains(browser, 'body', ' Your major: Empty ');
      lib.assertTextContains(browser, 'body', ' Your personal bio: Empty ');
    });

    function editProfileField(id, value) {
      return browser.clickLink('a#' + id)
        .then(function() {
          browser.fill('.editable-input .form-control', value);
          return browser.pressButton('.editable-submit');
        });
    }

    it.skip('should permit editing the profile', function() {
      return editProfileField('firstname', 'George')
        .then(function() { return editProfileField('lastname', 'Burdell'); })
        .then(function() { return editProfileField('major', 'CS'); })
        .then(function() { return editProfileField('bio', 'Yo yo yo'); })
        .then(function() {
          return browser.visit('/profile');
        })
        .then(function() {
          lib.assertTextContains(browser, 'body', ' Username: user ');
          lib.assertTextContains(browser, 'body', ' Email: user@example.com ');
          lib.assertTextContains(browser, 'body', ' Your first name: George ');
          lib.assertTextContains(browser, 'body', ' Your last name: Burdell ');
          lib.assertTextContains(browser, 'body', ' Your major: CS ');
          lib.assertTextContains(browser, 'body', ' Your personal bio: Yo yo yo ');
        });
    });
  });
});


