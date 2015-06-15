var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var router = express.Router();
var email_valid = require('email-validator');

router.route('/login')
  .get(function(req, res) {
    if(req.user === undefined) {
      res.render('login', { csrfToken: req.csrfToken() });
    } else {
      res.redirect('/profile');
    }
  })
  .post(function(req, res, next) {
      passport.authenticate('local',
      function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        if (!user) {
          return res.render('login', {
            message: info.message
            , csrfToken: req.csrfToken()
          });
        }
        req.login(user, function(err) {
          if(err) {
            return next(err);
          }
          return res.redirect('/')
        });
      })(req, res, next);
    }
);

router.route('/register')
  .get(function(req, res) {
    req.logout();
    res.render('register', { csrfToken: req.csrfToken() });
  })
  .post(function(req, res, next) {
    // TODO: Check passoword length > 6
    if (req.body.password !== req.body.confirmPassword) { // make sure password matches
      return res.render("register", { // if they didn't match reload the page
        message: "Error: Your password entries did not match" // and explain error
        , csrfToken: req.csrfToken()
      });
    }
    if (!email_valid.validate(req.body.email)) { // make sure email is valid
      return res.render("register", { // if invalid email reload the page
        message: "Error: The email address you submitted is invalid" // and explain error
        , csrfToken: req.csrfToken()
      });
    }
    User.register( // this should be valid register data
      new User({
        username: req.body.username
        , email: req.body.email
      }), //pass info to schema
      req.body.password,
      function(err) {
        if (err) {
          return res.render("register", {
            message: err
            , csrfToken: req.csrfToken()
          });
        }
        passport.authenticate('local')(req, res, function() {
          res.redirect('/');
        });
      }
    );
  });

router.get('/logout', function(req, res) {
  req.logout();
  return res.redirect("/"); //redirect to root if user logs out
});

module.exports = router;

