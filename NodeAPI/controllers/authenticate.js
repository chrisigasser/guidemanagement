exports.checkAuthentication = function (req, res) {
  User.find({}, function (err, results) {
    console.log(req.body);
    //console.log(req.username);
    /*results.forEach(function(element) {
      console.log('username:' + element.username);
    }, this);*/
    return res.send('endlich');
  });
};