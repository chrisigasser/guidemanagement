var express = require('express')
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/mydb";
var app = express();
 
app.get('/nextStation', function(req, res) {
  res.json({"Name": "Currently working on this feature"});
});

app.get('/stations', function(req, res) {
	
});
 
app.listen(3000)