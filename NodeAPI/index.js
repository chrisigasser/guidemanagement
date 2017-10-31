var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/guidemanagement";
var SHA256 = require("crypto-js/sha256");

 
//Test
 
app.get('/users', function(req, res) {

	var username = req.query.username;
	var reqpwd = req.query.passwd;
		
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  db.collection("users").findOne({}, {'username':username}, function(err, result) {
		if (err) throw err;
		if(reqpwd == SHA256(result.pwd))
			res.write("PASSED");
		else
			res.write("FAILED");
		db.close();
	  });
	});
	
	
})
 
app.listen(3000)
