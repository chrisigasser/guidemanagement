var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var mongoose = require('mongoose');
mongoose.connect(mongoUri);
User = mongoose.model('User');

exports.authenticate = function (req, res) {
  User.find({}, function (err, results) {
    return res.send(results);
  });
};