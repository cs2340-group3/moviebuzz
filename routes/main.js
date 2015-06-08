//include the express package in this project
var express = require('express') 
  , router = express.Router();

//set up the root route
router.get('/', function(req, res) {
  res.render('welcome', { user: req.user });
});

module.exports = router;

