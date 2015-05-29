var express = require('express')
  , app = express()
  , mongoose = require('mongoose');

// Import MongoDB configuration
var DB = require('./config/database')

// Use the configuration to connect database
mongoose.connect(DB.url);

app.get('/', function(req, res) {
  res.send('Hello, world!');
});

var port = process.env.PORT || 3000;
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
