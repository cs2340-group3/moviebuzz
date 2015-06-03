var passport = require('passport')
  , User = require('../models/user')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;

