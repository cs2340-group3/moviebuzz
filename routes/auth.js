var express = require('express')
  , User = require('../models/user')
  , passport = require('passport')
  , router = express.Router();

router.get('/', function(req, res) {
  if(req.session.passport.user === undefined) {
    res.redirect('/login');
  } else {
    res.redirect('/profile');
  }
});

router.get('/login', function(req, res) {
  if(req.session.passport.user === undefined) {
    res.render('login', { csrfToken: req.csrfToken() });
  } else {
    res.redirect('/profile');
  }
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local',
    function(err, user, info) {
      if (err) {
        return next(err); // will generate a 500 error
      }
      if (!user) {
        return res.render('login', {message: info.message});
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
    User.register(new User({ username: req.body.username }),
                  req.body.password, function(err) {
      if (err) {
        return res.render("register",
          {message: err}
        );
        return next(err);
      }
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    });
  });

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect("/");
});

router.get('/profile', function(req, res) {
  if(req.session.passport.user === undefined) {
    res.redirect('/login');
  } else {
    res.render('profile', {username: req.user.username});
  }
});

module.exports = router;

