var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  passwd: String
});

mongoose.model('User', UserSchema);