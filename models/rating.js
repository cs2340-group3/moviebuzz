var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
  username: String,
  major: String,
  movieId: String,
  score: Number,
  review: String
});

module.exports = mongoose.model('Rating', RatingSchema);

