var express = require('express');
var User = require('../models/user');
var router = express.Router();

function notLogin(req) {
  return req.user === undefined;
}

router.route('/profile')
  .all(function(req, res, next) {
    if (notLogin(req)) {
      return res.redirect('/');
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
      , csrfToken: req.csrfToken()
    });
  })
  .put(function (req, res) {
    if (!req.body) {
      return res.status(400).json({
        status: 'error'
        , msg: 'You\'ve sent a null request'
      });
    }
    var validFields = ["bio", "firstname", "lastname", "major"]
    if (validFields.indexOf(req.body.name) == -1) {
      return res.status(400).json({
        status: 'error'
        , msg: 'Invalid input'
      });
    }
    var updatedData = {};
    // TODO: First name, Last name, and major should contain only letters
    updatedData[req.body.name] = req.body.value;
    User.update({ username: req.user.username }, updatedData, function(err) {
      if (err) {
        return res.status(500).json({
          status: 'error'
          , msg: 'Database error?'
        });
      }
    });
    return res.sendStatus(200);
  });

module.exports = router;

