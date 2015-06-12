// Load libraries
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var expressSession = require('express-session');
var csrf = require('csurf');
var favicon = require('serve-favicon');
var handlebars  = require('express-handlebars');

// Set up express middlewares
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public/'));

// Set up favicon of gatech.edu
app.use(favicon(__dirname + '/public/favicon.ico'));

// Initiate Passport.js for authentication
app.use(expressSession({
  secret: 'testexpresssession'
  , resave: true
  , saveUninitialized: false
  , cookie: {
    httpOnly: true
    , secure: false // this can be set only if HTTPS
  }
}));

var passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Use CSRF Protection
// TODO: Add PUT here is just for debug
// TODO: Add csrf token to the profile.handlebars
app.use(csrf({ignoreMethods: ['PUT', 'GET', 'HEAD', 'OPTIONS']}));

// Enable handlebars template engine
var hbs = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.enable('view cache');

// Use the configuration to connect database
var DB = require('./config/database');
mongoose.connect(DB.url);

// Show the welcome page when a user comes to index.
var mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

// Ready to authenticate when a user comes to index page
var authRoutes = require('./routes/auth');
app.use('/', authRoutes);

var profileRoutes = require('./routes/profile');
app.use('/', profileRoutes);

// CSURF error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }
  res.status(403);
  res.render('error', {
    message: 'Form tempered with'
  });
});

// General error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
  });
});

var port = process.env.PORT || 3000; // port 3000 as default
app.listen(port, function() {
  console.log('Listening on port ' + port);
});

