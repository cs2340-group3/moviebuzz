var mongoose = require('mongoose');

var config = {
  url: process.env.MONGOLAB_URI || 'mongodb://localhost/test'
}; // The default port of MongoDB is 27017

module.exports = function() {
  mongoose.connect(config.url);
};

