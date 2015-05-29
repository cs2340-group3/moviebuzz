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

// Execute before each user.save() call
//UserSchema.pre('save', function(callback) {
  //var user = this;

   //Break out if the password hasn't changed
  //if (!user.isModified('password')) return callback();

   //Password changed so we need to hash it
  //bcrypt.genSalt(8, function(err, salt) {
    //if (err) return callback(err);

    //bcrypt.hash(user.password, salt, null, function(err, hash) {
      //if (err) return callback(err);
      //user.password = hash;
      //callback();
    //});
  //});
//});

//UserSchema.methods.verifyPassword = function(password, callback) {
  //bcrypt.compare(password, this.password, function(err, isMatch) {
    //if (err) return callback(err);
    //callback(null, isMatch);
  //});
//};

User.plugin(passportLocalMongoose, {usernameLowerCase: true});

module.exports = mongoose.model('User', UserSchema);

