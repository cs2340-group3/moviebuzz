var User = require('../models/user');
var passport = require('passport');
var emailValid = require('email-validator');

module.exports = {
  /**
   * Authenticate an existing user.
   */
  login: function(req, res, next) {
    passport.authenticate('local',
    function(err, user, info) {
      if (err) {
        return res.status(500).json({
          message: err
          , csrfToken: req.csrfToken()
        });
      }
      if (!user) {
        return res.status(403).json({
          message: info.message
          , csrfToken: req.csrfToken()
        });
      } else if (user.banned) {
        return res.status(403).json({
          message: 'You are banned'
          , csrfToken: req.csrfToken()
        });
      }
      req.login(user, function(err) {
        if(err) {
          return res.status(403).json({
            message: err
            , csrfToken: req.csrfToken()
          });
        }
        return res.sendStatus(200);
      });
    })(req, res, next);
  },

  /**
   * Register a new user.
   */
  register: function(req, res) {
    var alphanumeric = /^[a-zA-Z0-9]+$/;
    if (!alphanumeric.test(req.body.username)) {
      return res.status(403).json({
         message: 'Your username must be alphanumeric'
         , csrfToken: req.csrfToken()
      });
    }
    if (req.body.password.length < 6) { // Check password length
      return res.status(403).json({
         message: 'Error: your password length is too short'
         , csrfToken: req.csrfToken()
      });
    }
    if (!emailValid.validate(req.body.email)) { // make sure email is valid
      return res.status(403).json({ // if invalid email reload the page
        message: 'Error: The email address you submitted is invalid'
        , csrfToken: req.csrfToken()
      });
    }
    User.register( // this should be valid register data
      new User({
        username: req.body.username
        , email: req.body.email
      }), // pass info to schema
      req.body.password,
      function(err) {
        if (err && err.code === 11000) { // Duplicate key error of Mongoose
          return res.status(403).json({
            message: 'I\'m sorry, but someone else has already registered with that email address.'
            , csrfToken: req.csrfToken()
          });
        }
        if (err && err.code !== 11000) { // Other error
          return res.status(500).json({
            message: err.message
            , csrfToken: req.csrfToken()
          });
        }
        passport.authenticate('local')(req, res, function() {
          res.sendStatus(200);
        });
      }
    );
  },

  /**
   * Log out a currently logged in user.
   */
  logout: function(req, res) {
    req.logout();
    return res.redirect('/'); // redirect to root if user logs out
  }
};

