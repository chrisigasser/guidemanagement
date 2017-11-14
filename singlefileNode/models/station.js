var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var StationSchema = new Schema({
  id: String,
  name: String,
  desc: String
});

mongoose.model('Station', StationSchema);
module.exports = mongoose.model('Station');