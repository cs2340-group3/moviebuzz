var express = require('express')
  , User = require('../models/user')
  , passport = require('passport')
  , router = express.Router();

router.get('/login', function(req, res) {
  if(req.session.passport.user === undefined) {
    res.render('login', { csrfToken: req.csrfToken() });
  } else {
    res.redirect('/profile');
  }
});

router.post('/login', function(req, res, next) {
  // TODO: Implement 3-time failure restriction
  // and check if it's a locked or banned account
  // We should probably do it here, before going
  // to the authentication. Otherwise, we can look
  // into the library source code and customize it.
  // Also, a new field, number of failures, may be
  // added to the User model.
  //
  // Note: use req.body.username to get username
  // and User.findOne() to query database
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
        return res.redirect('/profile')
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
    User.register(
      new User({ username: req.body.username }),
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
  res.redirect("/");
});

router.get('/profile', function(req, res) {
  if(req.session.passport.user === undefined) {
    res.redirect('/login');
  } else {
    res.render('profile', { username: req.user.username });
  }
});

module.exports = router;

