var express = require('express');
var router = express.Router();
// This is Dr. Water's API
// TODO: Put this API key to config
var rotten = require('rotten-tomatoes-api')('yedukp76ffytfuy24zsqk7f5');
var Rating = require('../models/rating');

// require authentication
router.all('*', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  } else {
    next();
  }
});

function tomatoesError(err, loggedInfo, req) {
  res.status('400').render('error', {
    username: loggedInfo
    , csrfToken: req.csrfToken()
    , message: err
  });
}

router.get('/movie/:id', function(req, res) {
  var id = req.params.id;
  return rotten.movieGet({ id: id }, function(err, val) {
    var loggedInfo = req.user ? req.user.username : "";
    if (err) {
      return tomatoesError(err, loggedInfo, req);
    }
    Rating.findOne({ username: loggedInfo, movieId: id }, function(err, rating) {
      if (err) {
        return res.status('400').render('error', {
          username: loggedInfo
          , csrfToken: req.csrfToken()
          , message: err
        });
      }

      return res.render('movie', {
        username: loggedInfo
        , csrfToken: req.csrfToken()
        , movie: val
        , userRating: rating
      });
    });
  });
});

router.post('/movie/:id/rate', function(req, res) {
  var username = req.user.username;
  var movieId = req.params.id;
  var score = req.body.score;
  var review = req.body.review;
  console.log('test');

  var query = { username: username, movieId: movieId };
  var newDocument = 
    { username: username, movieId: movieId, score: score, review: review };

  return Rating.findOneAndUpdate(query, newDocument, {upsert: true}, function(err, movie) {
    var loggedInfo = req.user ? req.user.username : "";
    if (err) {
      return res.status('400').render('error', {
        username: loggedInfo
        , csrfToken: req.csrfToken()
        , message: err
      });
    }
    return res.redirect('/movie/' + movieId);
  });
});

router.get('/search/:keyword', function (req, res) {
  var query = req.params.keyword;
  return rotten.movieSearch({ q: query, page_limit: 20 }, function(err, val) {
    var loggedInfo = req.user ? req.user.username : "";
    if (err) {
      return res.status('400').render('error', {
        username: loggedInfo
        , csrfToken: req.csrfToken()
        , message: err
      });
    }
    return res.render('movies', {
      username: loggedInfo
      , csrfToken: req.csrfToken()
      , movies: val.movies
    });
  });
});

router.get('/recent/dvd', function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  var loggedInfo = req.user ? req.user.username : "";
  return rotten.listDvdsNewReleases({ page_limit: 20 }, function(err, val) {
    if (err) {
      return tomatoesError(err, loggedInfo, req);
    }
    return res.render('movies', {
      username: loggedInfo
      , csrfToken: req.csrfToken()
      , movies: val.movies
      , dvd: true
    });
  });
});

router.get('/recent/theaters', function (req, res) {
  var loggedInfo = req.user ? req.user.username : "";
  return rotten.listMoviesInTheaters({ page_limit: 20 }, function(err, val) {
    if (err) {
      return tomatoesError(err, loggedInfo, req);
    }
    return res.render('movies', {
      username: loggedInfo
      , csrfToken: req.csrfToken()
      , movies: val.movies
      , dvd: false
    });
  });
});

module.exports = router;

