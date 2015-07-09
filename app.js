/*
 * app.js
 * Main server file, used to initialize server config and set up routes.
 */

// Initialize app
var express = require('express');
var app = express();

// Load dependencies
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var handlebars = require('express-handlebars');
var morgan = require('morgan');
var path = require('path');

// Set up logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Set up body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up static content
app.use(express.static('public/'));

// Set up favicon of gatech.edu
app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

// Set up Passport.js
require('./config/passport')(app);

// Use CSRF Protection
require('./config/csrf')(app);

// Enable handlebars template engine
var hbs = handlebars.create(require('./config/handlebars'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Set up the database connection
require('./config/database')();

// Set up app routes
require('./config/routes')(app);

// General error handler
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    user: req.user
    , message: err.message
  });
});

module.exports = app;
if (!module.parent) {
  var port = process.env.PORT || 3000; // port 3000 as default
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
}

