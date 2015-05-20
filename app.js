var express = require('express');
var stormpath = require('express-stormpath');

var app = express();
app.set('views', './views');
app.set('view engine', 'jade');
app.use(stormpath.init(app));

app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});

app.use('/profile', stormpath.loginRequired, require('./profile')());

app.listen(3000);

