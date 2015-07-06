/*
 * routes.js
 * Set up the application's routes.
 */

var express = require('express');
var passport = require('passport');

/**
 * Configure all routes for the app.
 */
module.exports = function(app) {
  var main = require('../api/main');
  app.get('/', main.renderWelcomePage);

  var auth = require('../api/auth');
  app.use(express.Router()
    .post('/login', auth.login)
    .post('/register', auth.register)
    .get('/logout', auth.logout)
  );

  var movies = require('../api/movies');
  app.use(express.Router()
    .all('*', passport.requireAuth)
    .get('/movie/:id', movies.renderMovieDetail)
    .post('/movie/:id/rate', movies.rateMovie)
    .get('/search/:keyword', movies.renderSearch)
    .get('/recommendations', movies.renderRecommendations)
    .get('/recent/dvd', movies.renderDvdReleases)
    .get('/recent/theaters', movies.renderTheaterReleases)
  );

  var profile = require('../api/profile');
  app.use('/profile', express.Router()
    .all('*', passport.requireAuth)
    .get('/', profile.renderProfile)
    .put('/', profile.updateProfile)
  );

  var admin = require('../api/admin')
  app.use('/admin', express.Router()
    .all('*', passport.requireAdmin)
    .get('/', admin.renderAdminDashboard)
    .delete('/', admin.deleteUser)
    .put('/', admin.modifyUserStatus)
  );
};

