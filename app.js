// Load libraries
var express = require('express')
  , app = express()
  , mongoose = require('mongoose')
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , cookieParser = require('cookie-parser')
  , expressSession = require('express-session')
  , csrf = require('csurf')
  , handlebars  = require('express-handlebars');

// Load configuration and routes
var port = process.env.PORT || 3000 // port 3000 as default
  , passport = require('./config/passport')
  , DB = require('./config/database')
  , authRoutes = require('./routes/auth');

// set up express middlewares
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for csurf)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.use(passport.initialize());
app.use(passport.session());

// Use CSRF Protection
app.use(csrf());

// enable handlebars template engine
var hbs = handlebars.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.enable('view cache');

// Use the configuration to connect database
mongoose.connect(DB.url);

// Ready to authenticate when a user comes to index page
app.use('/', authRoutes);

// CSURF error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  res.status(403)
  res.render('error', { message: 'Form tempered with' });
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

