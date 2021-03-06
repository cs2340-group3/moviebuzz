var User = require('../models/user');

module.exports = {
  /**
   * Render the admin dashboard.
   */
  renderAdminDashboard: function(req, res, next) {
    User.find({}, function(err, users) {
      if (err) {
        next(err);
      }
      return res.render('admin', {
        user: req.user
        , users: users
        , csrfToken: req.csrfToken()
      });
    });
  },

  /**
   * Delete a user's account.
   */
  deleteUser: function(req, res) {
    var usernameRemove = req.body.username;
    User.remove({ username: usernameRemove }, function(err) {
      if (err) {
        return res.status(400).json({
          'error': 'Error removing user from MongoDB'
        });
      }
      return res.status(200).json({});
    });
  },

  /**
   * Modify a user's account status (ban, unban, unlock).
   */
  modifyUserStatus: function(req, res, next) {
    var action = req.body.action;
    var query = { username: req.body.username };
    if (action === 'unban') {
      User.findOneAndUpdate(query, { banned: false }, function(err) {
        if (err) {
          next(err);
        }
        return res.status(200).json({});
      });
    } else if (action === 'unlock') {
      User.findOneAndUpdate(query, { attempts: 0 }, function(err) {
        if (err) {
          next(err);
        }
        return res.status(200).json({});
      });
    } else if (action === 'ban') {
      User.findOneAndUpdate(query, { banned: true }, function(err) {
        if (err) {
          next(err);
        }
        return res.status(200).json({});
      });
    }
  }
};

