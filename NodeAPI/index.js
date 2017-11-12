var express = require('express');
var app = express();
//var MongoClient = require('mongodb').MongoClient;
//var SHA256 = require("crypto-js/sha256");
//var mongoUri = 'mongodb://localhost:27017/guidemanagement';
//var mongoose = require('mongoose');
//mongoose.connect(mongoUri);
//require('./Routes')(app);
//require('./models/user');
//var bodyParser = require('body-parser');
/*var db = mongoose.connection;
db.on('error', function () {
	throw new Error('unable to connect to database at ' + mongoUri);
});*/

app.get('/', function(req, res) {
	res.send('standard route');
 });


//app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.listen(3000);