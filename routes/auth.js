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
    var regEx = // valid email format
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (req.body.password !== req.body.confirmPassword) { //make sure password matches
    return res.render("register", { //if they didn't match reload the page
        message: "Error: Your password entries did not match" //and explain error
        , csrfToken: req.csrfToken()
      });
    } else if (!regEx.test(req.body.email)) { //make sure email is valid 
      return res.render("register", { //if invalid email reload the page
        message: "Error: The email address you submitted is invalid" //and explain error
        , csrfToken: req.csrfToken()
      });
    }
    User.register( // valid register data
        new User({ username: req.body.username, email: req.body.email, firstname: req.body.firstname, lastname: req.body.lastname }), //pass info to schema
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
  res.redirect("/"); //redirect to root if user logs out
});
router.get('/editProfile', function(req, res){
  res.render('editProfile', {username: req.user.username,
    email: req.user.email,
    password: req.user.password
    
  });
});


router.get('/profile', function(req, res) {
  if(req.session.passport.user === undefined) { //if they aren't logged in make them log in
    res.redirect('/login');
  } else {

    res.render('profile', { username: req.user.username,
    email: req.user.email
      
    });

  }
});


module.exports = router;

