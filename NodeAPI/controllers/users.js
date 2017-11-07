var mongoose = require('mongoose'),
//User = mongoose.model('User');

exports.authenticate = function (req, res) {
  User.find({}, function (err, results) {
    return res.send(results);
  });
};