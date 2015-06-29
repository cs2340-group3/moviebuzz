var express = require('express');
var router = express.Router();

// Set up the root route
router.get('/', function(req, res) {
  var loggedInfo = req.user ? req.user.username : "";
  res.render('welcome', {
    username: loggedInfo
    , csrfToken: req.csrfToken()
    , is_admin: req.user ? req.user.is_admin : false
  });
});

module.exports = router;

