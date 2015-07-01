var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

router.get('/admin', passport.requireAdmin, function(req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      next(err);
    }
    return res.render('admin', {
      user: req.user
      , users: users
      , csrfToken: req.csrfToken()
    });
  });
});

module.exports = router;
