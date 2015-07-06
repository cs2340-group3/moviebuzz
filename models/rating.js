/*
 * rating.js
 * Sets up a Rating model for storing a single user's rating of a single movie.
 */

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

