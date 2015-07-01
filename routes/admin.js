var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.route('/admin')
  .all(function (req, res, next) {
    if (!req.user.is_admin) {
      return res.redirect('/');
    }
    next();
  })
  .get(function (req, res) {
    User.find({}, function (err, users) {
      if (err) {
        return res.status(400).render('error', {
          message: "Mongo error"
          , username: req.user ? req.user.username : ""
          , csrfToken: req.csrfToken()
          , is_admin: req.user ? req.user.is_admin : false
        });
      }
      return res.render('admin', {
        username: req.user ? req.user.username : ""
        , csrfToken: req.csrfToken()
        , is_admin: req.user ? req.user.is_admin : false
        , users: users
      });
    });
  })
  .delete(function (req, res) {
    var usernameRemove = req.body.username;
    User.remove({username: usernameRemove}, function (err) {
      if (err) {
        return res.status(400).json({
          'error': 'Error removing user from MongoDB'
        })
      }
      return res.status(200).json({});
    });
  })
  .put(function (req, res) {
    var action = req.body.action;
    var query = {username: req.body.username};
    if (action === "unban") {
      User.findOneAndUpdate(query, {banned: false}, function (err) {
        if (err) {
          // TODO: Tim refactored error handling
        }
        return res.status(200).json({});
      });
    } else if (action === "unlock") {
      User.findOneAndUpdate(query, {attempts: 0}, function (err) {
        if (err) {
          // TODO
        }
        return res.status(200).json({});
      });
    } else if (action === "ban") {
      User.findOneAndUpdate(query, {banned: true}, function (err) {
        if (err) {
          // TODO
        }
        return res.status(200).json({});
      });
    }
  });

module.exports = router;

