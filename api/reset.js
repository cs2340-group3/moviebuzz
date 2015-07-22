var User = require('../models/user');

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

  // Render password recovery/reset page.
  renderResetPage: function (req, res) {
    return res.render('reset', {
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

        return res.status(200).json({});
      });
    }
  }

};

