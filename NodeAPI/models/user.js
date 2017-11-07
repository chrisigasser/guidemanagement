var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  pwd: String
});

mongoose.model('User', UserSchema);