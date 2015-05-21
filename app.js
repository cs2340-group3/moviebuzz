var express = require('express');
var http = require('http');
var app = express();

// set up routes

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port " + port);
});

