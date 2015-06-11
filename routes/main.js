var express = require('express');
var router = express.Router();

// Set up the root route
router.get('/', function(req, res) {
  res.render('welcome', { user: req.user });
});

module.exports = router;
