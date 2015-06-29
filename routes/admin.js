var express = require('express');
var router = express.Router();

router.get('/admin', function(req, res) {
  if (!req.user.is_admin) {
    return res.redirect('/');
  }
  var loggedInfo = req.user ? req.user.username : "";
  res.render('admin', {
    username: loggedInfo
    , csrfToken: req.csrfToken()
    , is_admin: req.user ? req.user.is_admin : false
  })
});

module.exports = router;
