var express = require('express')
  , app = express()
  , mongoose = require('mongoose')
  , port = process.env.PORT || 3000 // port 3000 as default
  , bodyParser = require('body-parser')
  , morgan = require('morgan')
  , cookieParser = require('cookieParser');

// Import MongoDB configuration
var DB = require('./config/database')

// Use the configuration to connect database
mongoose.connect(DB.url);

// set up express middlewares
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());

app.get('/', function(req, res) {
  res.send('Hello, world!');
});

app.listen(port, function() {
  console.log('Listening on port ' + port);
});

//var Schema = mongoose.Schema;
//var BlogPostSchema = new Schema({
  //title   : String
  //, body  : String
  //});
//var BlogPost = mongoose.model('BlogPost', BlogPostSchema);
//var p = new BlogPost();
//p.title = "Testing 2";
//p.body = "Test body";
//p.save(function(err) {
  //if (!err) console.log('Success!');
//})

