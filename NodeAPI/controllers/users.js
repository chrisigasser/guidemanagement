var mongoose = require('mongoose'),
User = mongoose.model('user');

exports.authenticate = function (req, res) {
  User.find({}, function (err, results) {
    return res.send(results);
  });
};