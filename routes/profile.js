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
      , major: req.user.major
      , bio: req.user.bio
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
    // 
    var goodData = ["bio", "firstname", "lastname", "major", "email", "username"];
    if (goodData.indexOf(req.body.name) == -1) {
      
        return res.status(400).json({
          status: 'error'
          , msg: 'Invalid input'
        });
      
    }
    updatedData[req.body.name] = req.body.value;
    User.update({ username: req.user.username }, updatedData, function(err) {
      if (err) {
        return res.status(400).json({
          status: 'error'
          , msg: 'Database error?'
        });
      }
    });
    return res.sendStatus(200);
  });

module.exports = router;
