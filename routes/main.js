var express = require('express');
var router = express.Router();
var rotten = require('rotten-tomatoes-api')('yedukp76ffytfuy24zsqk7f5');

// Set up the root route
router.get('/', function(req, res) {
  var loggedInfo = req.user ? req.user.username : "";
  return rotten.listDvdsNewReleases({ page_limit: 20 }, function(err, val) {
    if (err) {
      return tomatoesError(err, loggedInfo, req);
    }
    return res.render('welcome', {
      username: loggedInfo
      , csrfToken: req.csrfToken()
      , movies: val.movies
    });
  });
});

module.exports = router;
