var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
//var mongoose = require('mongoose');
//mongoose.connect(mongoUri);
//var User = require('./models/user');
//var Station = require('./models/station');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());


app.post('/checkAuthentification', function (req, res) {
    try {
        if (req.body != undefined) {
            console.log(req.body);

            var credentials = req.body.credentials;
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        res.send('PASSED');
                    } else {
                        res.send('FAILED');
                    }
                    db.close();
                });
            });
        }
        //res.send('FAILED');
    } catch (error) {
        console.log('oh no exception');
    }

});

app.post('/getstations', function (req, res) {
    try {
        allstationen = [];
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        db.collection("stationen").find({}).toArray(function (err, result) {
                            if (err) {
                                throw "Could not access the table in the database"
                            }
                            console.log(req.body.runningRoute);
                            if (req.body.runningRoute != undefined) {
                                result.forEach(function (element) {
                                    if (!element.visited.any(
                                        function (e) {
                                            console.log(e.routenID + ':' + req.body.runningRoute);
                                            return (e.routenID == req.body.runningRoute && e.end != -1);
                                        }
                                    )) {
                                        allstationen.push(element);
                                    }
                                }, this);
                            }
                            else {
                                result.forEach(function (element) {
                                    allstationen.push(element);
                                }, this);
                            }
                            res.json(allstationen);
                        });
                    } else {
                        res.send('FAILED');
                    }
                    db.close();
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
    }
});

app.post('/newRoute', function (req, res) {
    try {
        if (req.body != undefined) {
            //if(!checkCredentials(req.body.credentials))
            //    return res.send('FAILED');
            var credentials = req.body.credentials;
            console.log(req.body);
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        db.collection("users").findOne({ username: credentials.username }, function (err, result) {
                            var myobj = {
                                start: req.body.starttime,
                                end: '',
                                reihenfolge: [],
                                guide: result._id
                            };
                            //onsole.log(myobj);
                            db.collection("routen").insertOne(myobj, function (err, insertresult) {
                                if (err) throw err;
                                res.send(insertresult.insertedId);
                                //res.send('123pichlerisgay123');
                                //console.log(insertresult);
                            });
                        });

                    } else {
                        res.send('FAILED');
                    }
                    //db.close();
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
    }
});

app.post('/endRoute', function (req, res) {
    try {
        if (req.body != undefined) {
            //if(!checkCredentials(req.body.credentials))
            //    return res.send('FAILED');
            var credentials = req.body.credentials;
            console.log(req.body);
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        var myquery = { _id: ObjectID(req.body.id) };
                        //var newvalues = {$set: {end: req.body.endtime}};
                        var newvalues = { $set: { end: req.body.endtime } };

                        db.collection("routen").updateOne(myquery, newvalues, function (err, result) {
                            if (err) throw err;
                            console.log('Route ended:' + result);
                        });
                        db.collection("routen").findOne(myquery, function (err, resultRouten) {
                            if (err) throw err;
                            var difference = parseInt(req.body.endtime) - parseInt(resultRouten.start);
                            console.log(req.body.endtime + ':' + resultRouten.start);
                            res.send(difference + "");
                        });
                    } else {
                        throw "damn";
                    }
                    //db.close();
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
        res.send('-1');
    }

<<<<<<< HEAD
});

app.post('/startStation', function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            console.log(req.body);
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        var myquery = { name: req.body.stationName };
                        var newvalues = {
                            $push: {
                                visited: {
                                    start: req.body.start,
                                    routenID: req.body.routenID,
                                    end: -1
                                }
                            }
                        };

                        db.collection("stationen").updateOne(myquery, newvalues, function (err, result) {
                            if (err) throw err;
                            console.log('Station gestartet:' + result);
                        });
                        res.send('1');
                    } else {
                        res.send('FAILED');
                    }
                    //db.close();
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
    }
});
app.post('/endStation', function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            console.log(req.body);
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        var myquery = { name: req.body.stationName, "visited.routenID": req.body.routenID };
                        var newvalues = { $set: { "visited.$.end": req.body.end } };
                        console.log(myquery);
                        db.collection("stationen").updateOne(myquery, newvalues, function (err, result) {
                            if (err) throw err;
                            console.log('Station beendet:' + result);
                        });
                        res.send('1');
                    } else {
                        res.send('FAILED');
                    }
                    //db.close();
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
    }
});
app.listen(3000);
=======
app.listen(3000);
console.log("Server up and running on port 3000");
>>>>>>> 7cf718c85ec9dbac59630f16568eb2d0586758fc
