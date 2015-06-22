var express = require('express');
var router = express.Router();
var rotten = require('../config/rotten.js');

function tomatoesError(err, loggedInfo, req) {
  res.status('400').render('error', {
    username: loggedInfo
    , csrfToken: req.csrfToken()
    , message: err
  });
}

router.get('/recent/:option', function (req, res) {
  var loggedInfo = req.user ? req.user.username : "";

  var option = req.params.option.toLowerCase();
  if (option !== "dvd" && option !== "movie") {
    return res.status('400').render('error', {
      username: loggedInfo
      , csrfToken: req.csrfToken()
      , message: "You can only get movie and DVD."
    });
  }

  if (option === "dvd") {
    return rotten.listDvdsNewReleases({ page_limit: 20 }, function(err, val) {
      if (err) {
        return tomatoesError(err, loggedInfo, req);
      }
      return res.render('recent', {
        username: loggedInfo
        , csrfToken: req.csrfToken()
        , movies: val.movies
        , dvd: true
      });
    });
  } else {
    return rotten.listMoviesInTheaters({ page_limit: 20 }, function(err, val) {
      if (err) {
        return tomatoesError(err, loggedInfo, req);
      }
      return res.render('recent', {
        username: loggedInfo
        , csrfToken: req.csrfToken()
        , movies: val.movies
        , dvd: false
      });
    });
  }
});

module.exports = router;

