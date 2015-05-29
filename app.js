var express = require('express')
  , app = express()
  , mongoose = require('mongoose')
  , port = process.env.PORT || 3000 // port 3000 as default
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , cookieParser = require('cookieParser')
  , expressSession = require('express-session')
  , passport = require('./config/passport')
  , DB = require('./config/database')
  , handlebars  = require('express-handlebars')
  , authRoutes = require('./routes/auth');

// set up express middlewares
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Initiate Passport.js for authentication
app.use(expressSession({
    secret: 'testexpresssession'
    , resave: true
    , saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// enable handlebars template engine
var hbs = handlebars.create({defaultLayout: 'main'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.enable('view cache');

// Use the configuration to connect database
mongoose.connect(DB.url);

// Ready to authenticate when a user comes to index page
app.use('/', authRoutes);

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

