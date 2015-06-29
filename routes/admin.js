var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/admin', function(req, res) {
  if (!req.user.is_admin) {
    return res.redirect('/');
  }
  var loggedInfo = req.user ? req.user.username : "";
  User.find({}, function (err, users) {
    if (err) {
      return res.render('admin', {
        username: loggedInfo
        , csrfToken: req.csrfToken()
        , is_admin: req.user ? req.user.is_admin : false
        , error: "Mongo error"
      });
    }
    return res.render('admin', {
      username: loggedInfo
      , csrfToken: req.csrfToken()
      , is_admin: req.user ? req.user.is_admin : false
      , users: users
    });
  });
});

module.exports = router;
