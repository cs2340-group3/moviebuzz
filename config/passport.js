/*
 * passport.js
 * Set up Passport.js for user authentication and authorization.
 */

var passport = require('passport');
var expressSession = require('express-session');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null, profile);
    /*User.findOrCreate(, function(err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });*/
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.requireAuth = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
};

passport.requireAdmin = function(req, res, next) {
  if (!req.isAuthenticated() || !req.user.is_admin) {
    return res.redirect('/');
  }
  next();
};

// Configure Passport-related middleware
module.exports = function(app) {
  app.use(expressSession({
    secret: 'testexpresssession'
    , resave: true
    , saveUninitialized: false
    , cookie: {
      httpOnly: true
      , secure: false // this can be set only if HTTPS
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
  }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook'));
};

