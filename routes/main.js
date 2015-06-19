var express = require('express');
var router = express.Router();

// Set up the root route
router.get('/', function(req, res) {
  var loggedInfo = "";
  if (req.user === undefined) {
    loggedInfo = undefined;
  } else {
    loggedInfo = req.user.username;
  }
  res.render('welcome', {
    username: loggedInfo
    , csrfToken: req.csrfToken()
  });
});

module.exports = router;
