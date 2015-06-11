var express = require('express');
var User = require('../models/user');
var router = express.Router();

function notLogin(req) {
  return req.user === undefined;
}

router.route('/profile')
  .all(function(req, res, next) {
    if (notLogin(req)) {
      return res.redirect('/login');
    }
    next();
  })
  .get(function(req, res) {
    res.render('profile', {
      username: req.user.username
      , email: req.user.email
      , firstname: req.user.firstname
      , lastname: req.user.lastname
    });
  })
  .put(function (req, res) {
    if (!req.body) {
      return res.status(400).json({
        status: 'error'
        , msg: 'You\'ve sent a null request'
      });
    }
    var updatedData = {};
    // TODO: This is certainly not secure
    updatedData[req.body.name] = req.body.value;
    User.update({ username: req.user.username }, updatedData, function(err) {
      if (err) {
        return res.status(400).json({
          status: 'error'
          , msg: 'Database error?'
        });
      }
      return res.status(200);
    });
  });

module.exports = router;
