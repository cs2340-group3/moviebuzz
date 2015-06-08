var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose');

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
  locked: { // locked because they incorrectly loogged in 3 times
    type: Boolean
    , required: true
    , default: false
  },
  bio: { // This is a free text for a user to talk about their interests
    type: String
    , trim: true
  }
});

UserSchema.plugin(passportLocalMongoose, {usernameLowerCase: true});

module.exports = mongoose.model('User', UserSchema);

