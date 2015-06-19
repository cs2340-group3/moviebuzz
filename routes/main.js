var express = require('express');
var router = express.Router();

// Set up the root route
router.get('/', function(req, res) {
  var loggedInfo = req.user ? req.user.username : "";
  res.render('welcome', {
    username: loggedInfo
    , csrfToken: req.csrfToken()
  });
});

module.exports = router;

