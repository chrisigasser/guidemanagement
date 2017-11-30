var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
//var mongoose = require('mongoose');
//mongoose.connect(mongoUri);
//var User = require('./models/user');
//var Station = require('./models/station');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

var users = [
    {
        username: 'fabian',
        pwd: 'asdf'
    },
    {
        username: 'chrisi',
        pwd: 'xyz'
    }
];
var stations = [
    {
        id: 1,
        name: 'Arduino',
        desc: 'Dieser Stand handelt von Arduinos'
    },
    {
        id: 2,
        name: 'Sharepoint',
        desc: 'Dieser Stand handelt von etwas grausamen'
    }
];


app.post('/checkAuthentification', function (req, res) {
    try {
        if (req.body != undefined) {
            console.log(req.body);
            //if(checkCredentials(req.body.credentials)){
            //    return res.send('PASSED');
            //}   
            var credentials = req.body.credentials;
            //console.log(User.findOne({username: credentials.username, pwd: credentials.pwd}));
            /*User.count({username: credentials.username, pwd: credentials.pwd}, function (err, count) {  
                console.log("Anzahl: " + count);
                if(count>0)
                    res.send('PASSED');
                else
                    res.send('FAILED');
            });*/
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0)
                        res.send('PASSED');
                    else
                        res.send('FAILED');
                    db.close();
                });
            });
            /*User.find({username: credentials.username, pwd: credentials.pwd}, function (err, results) {
                res.send('PASSED');
            });*/
        }
        //res.send('FAILED');
    } catch (error) {
        console.log('oh no exception');   
    }
    
});

app.post('/getStations', function (req, res) {
    try {
        allStations = [];
        if (req.body != undefined) {
            //if(!checkCredentials(req.body.credentials))
            //    return res.send('FAILED');
            var credentials = req.body.credentials;
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        db.collection("stations").find({}).toArray(function (err, result) {
                            if(err) {
                                throw "Could not access the table in the database"
                            }
                            result.forEach(function(element) {
                                allStations.push(element);
                            }, this);
                            res.json(allStations);
                        });
                    } else {
                        res.send('FAILED');
                    }
                    db.close();
                });
            });
            /*User.count({username: credentials.username, pwd: credentials.pwd}, function (err, count) {  
                console.log("Anzahl: " + count);
                if(count>0){
                    mongoose.connect(mongoUriStations);
                    Station.find({},function(err, result){
                        console.log(result);
                        res.send(result);
                    });
                }
                else
                {
                    res.send('FAILED');
                }
            });    */
        }
    } catch (error) {
        console.log('oh no exception');  
    }
    
});

//async struggle
function checkCredentials(credentials) {
    /*if (credentials.username != undefined && credentials.pwd != undefined) {
        if (users.some(function(elem){return (elem.username == credentials.username && elem.pwd == credentials.pwd)})) {
            return true;
        }
    }
    return false;*/
    valid = false;
    /*User.find({username: credentials.username, pwd: credentials.pwd}, function (err, results) {
        resizeBy.send('PASSED');
    });*/
    console.log(valid);
    return valid;
}

app.listen(3000);
console.log("Server up and running on port 3000");