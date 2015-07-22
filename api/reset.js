var User = require('../models/user');
var emailValid = require('email-validator');

var reset = function (username, newPassword, cb) {
  User.findOne({ 'username': username }, function(err, user) {
    if (err) return cb(err);
    if (!user) return cb({ message: 'Username not exist' });

    user.setPassword(newPassword, function (err, user) {
      if (err) return cb(err);
      user.save(function(err) {
        if (err) return cb(err);
        cb(null);
      });
    });
  });
};

module.exports = {

  // Render password recovery page.
  renderRecoverPage: function (req, res) {
    return res.render('recover', {
      user: req.user
      , csrfToken: req.csrfToken()
    });
  },

  // Reset user password. Obtain new password from POST request
  resetPassword: function (req, res) {
    if (!req.body.password || req.body.password.length < 6) {
      // No password submitted or too short
      return res.status(403).json({
        message: "Invalid new password"
        , csrfToken: req.csrfToken()
      });
    }

    // Request from a logged in user
    if (req.user) {
      return reset(req.user.username, req.body.password, function (err) {
        if (err) { // Server internal error
          return res.status(500).json({
            message: err.message
            , csrfToken: req.csrfToken()
          });
        }
        // Success
        return res.status(200).json({});
      });
    }

    if (req.params.username) { // Coming from Email recovery
      // TODO
    }
  },

  forgot: function (req, res) {
    if (!req.body.email || !emailValid.validate(req.body.email)) {
      return res.status(400).json({
          message: "Not a valid email address"
        , csrfToken: req.csrfToken()
      });
    }
    // TODO
  }

};

