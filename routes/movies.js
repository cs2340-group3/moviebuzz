var express = require('express');
var router = express.Router();
var rotten = require('../config/rotten.js');
var async = require('async');
var rateLimit = require('function-rate-limit');
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
        , is_admin: req.user ? req.user.is_admin : false
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

  var query = { username: username, movieId: movieId };
  var newDocument = {
    username: username
    , movieId: movieId
    , major: req.user.major
    , score: score
    , review: review
  };

  return Rating.findOneAndUpdate(query, newDocument, { upsert: true }, function(err, movie) {
    var loggedInfo = req.user ? req.user.username : "";
    if (err) {
      return res.status('400').render('error', {
        username: loggedInfo
        , is_admin: req.user ? req.user.is_admin : false
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
        , is_admin: req.user ? req.user.is_admin : false
        , message: err
      });
    }
    return res.render('movies', {
      username: loggedInfo
      , is_admin: req.user ? req.user.is_admin : false
      , csrfToken: req.csrfToken()
      , movies: val.movies
    });
  });
});

router.get('/recommendations', function(req, res) {
  async.waterfall([
    function(cb) {
      Rating.aggregate()
        .match({ major: req.user.major })
        .group({
          _id: { movieId: '$movieId' },
          // NOTE: averageUserScore does not end up in the final movie
          // objects returned from RT. It is only used for sorting.
          averageUserScore: { $avg: '$score' }
        })
        .sort({ averageUserScore: -1 })
        .exec(cb);
    },

    // moviesBare is now an array of all movies rated by someone in
    // the user's major, in descending order by average score. ('bare'
    // means it doesn't have full details.)
    function(moviesBare, cb) {
      // for each sourceMovie from the db...
      async.concatSeries(moviesBare, function(srcMovieBare, concatCb) {
        // get the movie details...
        rotten.movieGet({ id: srcMovieBare._id.movieId }, function(err, srcMovie) {
          // find similar movies to the source movie
          rotten.movieSimilar({ id: srcMovieBare._id.movieId }, function(err, result) {
            if (!result.movies) console.log(result);
            if (err)
              concatCb(err);
            // make an array of [srcMovie, <similar movies...>]
            result.movies.unshift(srcMovie);
            // concat that to the array being produced by async.concatSeries
            concatCb(null, result.movies);
          });
        });
      }, cb);
    },

    // filter out movies that this user has rated
    function(recommendations, cb) {
      Rating.find({ username: req.user.username }, function(err, ratings) {
        debugger;
        if (err) cb(err);
        recommendations = recommendations.filter(function(recommendation) {
          return !ratings.some(function(rating) {
            // NOTE: use "==" here because rating.movieId is a string, while
            // recommendation.id (which comes from the RottenTomatoes API) is
            // a number.
            return rating.movieId == recommendation.id;
          });
        });
        cb(null, recommendations);
      });
    }
  ],
  
  // recommendation *should* now be the array of movie recommendations,
  // including movies the user himself has rated.
  function(err, recommendations) {
    if (err) {
      return tomatoesError(err, req.user.username, req);
    }
    res.render('movies', {
      username: req.user ? req.user.username : ""
      , is_admin: req.user ? req.user.is_admin : false
      , csrfToken: req.csrfToken()
      , movies: recommendations
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
      , is_admin: req.user ? req.user.is_admin : false
      , csrfToken: req.csrfToken()
      , movies: val.movies
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
      , is_admin: req.user ? req.user.is_admin : false
      , csrfToken: req.csrfToken()
      , movies: val.movies
    });
  });
});

module.exports = router;

