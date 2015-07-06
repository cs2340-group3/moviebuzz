/*
 * user.js
 * Sets up a User model for storing a user's information.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  username: {
    type: String
    , required: true
    , lowercase: true // 'ABC' is equivalent 'abc'
    , trim: true // ' abc ' will be trimmed to 'abc'
    , index: { unique: true }
  },
  firstname: { //legal first name of user
    type: String
    , lowercase: false
    , trim: true
  },
  lastname: { //legal last name of user
    type: String
    , lowercase: false
    , trim: true
  },
  password: {
    type: String
  },
  email: {
    type: String
    , required: true
    , lowercase: true
    , trim: true
    , index: { unique: true }
  },
  date_created: { // when the user created his account
    type: Date
    , required: true
    , default: Date.now
  },
  banned: { // whether the user is banned by admin
    type: Boolean
    , required: true
    , default: false
  },
  major: { // the user's academic major
    type: String
    , trim: true
  },
  is_admin: {
    type: Boolean
    , required: true
    , default: false
  },
  bio: { // This is a free text for a user to talk about their interests
    type: String
    , trim: true
  }
});

UserSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true
  , limitAttempts: true
  , maxAttempts: 3
});

module.exports = mongoose.model('User', UserSchema);

