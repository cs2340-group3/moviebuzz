var async = require('async');

var rotten = require('../config/rotten.js');
var Rating = require('../models/rating');

module.exports = {
  /**
   * Renders a movie detail page to the response.
   */
  renderMovieDetail: function(req, res, next) {
    var id = req.params.id;
    return rotten.movieGet({ id: id }, function(err, val) {
      if (err) {
        return next(err);
      }
      var username = req.user.username;
      Rating.findOne({ username: username, movieId: id }, function(err, rating) {
        if (err) {
          return next(err);
        }
        return res.render('movie', {
          user: req.user
          , movie: val
          , userRating: rating
          , csrfToken: req.csrfToken()
        });
      });
    });
  },

  /**
   * Submit a rating for a movie.
   */
  rateMovie: function(req, res, next) {
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

    return Rating.findOneAndUpdate(query, newDocument, { upsert: true }, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/movie/' + movieId);
    });
  },

  /**
   * Search for movies by title.
   */
  renderSearch: function(req, res, next) {
    var query = req.params.keyword;
    return rotten.movieSearch({ q: query, page_limit: 20 }, function(err, val) {
      if (err) {
        return next(err);
      }
      return res.render('movies', {
        user: req.user
        , movies: val.movies
        , csrfToken: req.csrfToken()
      });
    });
  },

  /**
   * Get recommendations for based on major and similar movies.
   */
  renderRecommendations: function(req, res, next) {
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
            if (err) {
              concatCb(err);
            }
            // find similar movies to the source movie
            rotten.movieSimilar({ id: srcMovieBare._id.movieId }, function(err, result) {
              if (err) {
                concatCb(err);
              }
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
          if (err) {
            cb(err);
          }
          recommendations = recommendations.filter(function(recommendation) {
            return !ratings.some(function(rating) {
              // NOTE: use '==' here because rating.movieId is a string, while
              // recommendation.id (which comes from the RottenTomatoes API) is
              // a number.
              return rating.movieId == recommendation.id; // eslint-disable-line
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
        return next(err);
      }
      res.render('movies', {
        user: req.user
        , movies: recommendations
        , csrfToken: req.csrfToken()
      });
    });
  },

  /**
   * Get recent DVD releases.
   */
  renderDvdReleases: function(req, res, next) {
    return rotten.listDvdsNewReleases({ page_limit: 20 }, function(err, val) {
      if (err) {
        return next(err);
      }
      return res.render('movies', {
        user: req.user
        , movies: val.movies
        , csrfToken: req.csrfToken()
      });
    });
  },

  /**
   * Get recent theater releases.
   */
  renderTheaterReleases: function(req, res, next) {
    return rotten.listMoviesInTheaters({ page_limit: 20 }, function(err, val) {
      if (err) {
        return next(err);
      }
      return res.render('movies', {
        user: req.user
        , movies: val.movies
        , csrfToken: req.csrfToken()
      });
    });
  }
};

