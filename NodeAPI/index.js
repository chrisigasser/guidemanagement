var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var SHA256 = require("crypto-js/sha256");
require('./Routes')(app);
require('./models/user');
require('./Routes')(app);
mongoose = require('mongoose');

var mongoUri = 'mongodb://localhost:27017/guidemanagement';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
	throw new Error('unable to connect to database at ' + mongoUri);
});

var app = express();

app.configure(function () {
	app.use(express.bodyParser());
});

app.listen(3000);
//Test
/*
app.get('/users', function(req, res) {
	console.log('new get request on /users');
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
	
})*/