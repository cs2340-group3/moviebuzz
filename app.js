var express = require('express');
var app = express();

// configure client-side asset endpoints
app.use(express.static('views'));
app.use(express.static('bower_components'));

// configure api endpoints

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port ' + port);
});

