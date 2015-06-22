var express = require('express');
var router = express.Router();
// This is Dr. Water's API
// TODO: Put this API key to config
var rotten = require('rotten-tomatoes-api')('yedukp76ffytfuy24zsqk7f5');

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
    console.log('test');
    return res.render('movie', {
      username: loggedInfo
      , csrfToken: req.csrfToken()
      , movie: val
    });
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

