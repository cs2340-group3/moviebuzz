var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
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

module.exports = passport;

