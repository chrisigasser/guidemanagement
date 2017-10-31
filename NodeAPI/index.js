var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/guidemanagement";
var SHA256 = require("crypto-js/sha256");

 

 
app.get('/users', function(req, res) {

	var username = req.query.username;
	var reqpwd = req.query.passwd;
	var response = "FAILED";
		
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  db.collection("users").findOne({}, {'username':username}, function(err, result) {
		if (err) throw err;
		if(rewpwd == SHA256(result.pwd))
			response = "PASSED";
		
		db.close();
	  });
	});
	
	res.write(response);
})
 
app.listen(3000)
