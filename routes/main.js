var express = require('express');
var router = express.Router();
var rotten = require('rotten-tomatoes-api')('yedukp76ffytfuy24zsqk7f5');

// Set up the root route
router.get('/', function(req, res, next) {
  return rotten.listDvdsNewReleases({ page_limit: 20 }, function(err, val) {
    if (err) {
      return next(err);
    }
    return res.render('welcome', {
      user: req.user
      , movies: val.movies
      , csrfToken: req.csrfToken()
    });
  });
});

module.exports = router;
