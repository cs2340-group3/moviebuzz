var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , DB = require('../config/database')

mongoose.connect(DB.url);

var UserSchema = new Schema({
  user_name: {
    type: String
    , required: true
    , lowercase: true // 'ABC' is equivalent 'abc'
    , trim: true // ' abc ' will be trimmed to 'abc'
    , index: { unique: true }
  },
  password: {
    type: String
    , required: true
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

var User = mongoose.model('User', UserSchema);
module.exports = {
  User: User
};

