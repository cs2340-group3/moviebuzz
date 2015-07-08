/* eslint-disable no-unused-vars */

var lib = require('./lib');
var assert = require('assert');

describe('M5 functionality', function() {
  lib.setUp();

  // make browser available in closure
  var browser;
  before(function() { browser = this.browser; });

  // log in at the beginning of these tests
  // /login no longer exist
  before(function() {
    // return lib.login(browser);
  });

  describe('main page', function() {

    it('should have a way to navigate to search');

  });

  describe('searching', function() {

    it('should have a way to search movies');

    it('should have a way to display new theater releases');

    it('should have a way to display new DVD releases');

  });
});

