var express = require('express');
var User = require('../models/user');
var router = express.Router();
var passport = require('passport');

router.route('/profile')
  .all(passport.requireAuth)
  .get(function(req, res) {
    res.render('profile', {
      user: req.user
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

