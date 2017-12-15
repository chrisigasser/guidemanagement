var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Balancer = require('./loadbalancer');
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
            //console.log(req.body);

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
                            if (req.body.runningRoute != undefined) {
                                result.forEach(function (element) {
                                    //console.log();
                                    if (!element.visited.some(
                                        function (e) {
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

app.post('/getstation', function (req, res) {
    try {
        allstationen = [];
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        db.collection('stationen').find({name: {$ne: 'next = generated'}, visited: {$not: {$elemMatch: {routenID: req.body.runningRoute}}}}).toArray(function (err, result) {
                            if (err) throw err;
                            
                            var extracted = Balancer.extractInfo(result);
                            var withCurCount = [];
                            withCurCount = extracted.map(y => {
                                var temp = y;
                                //console.log(allstationen);
                                var tobecounted = result.find(tof => {
                                    return tof.name == y.id;
                                });
                                temp.curpeople = tobecounted.visited.filter(function (x) { return (x.end == -1) }).length
                                return temp;
                            });
                            //console.log(withCurCount);
                            var toreturn = Balancer.findRecommended(withCurCount, 2);
                            toreturn = toreturn.map(mapelem => {
                                return mapelem.id;
                            });
                            res.send(toreturn);
                        });
                    }
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
            //console.log(req.body);
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        db.collection("users").findOne({ username: credentials.username }, function (err, result) {
                            var myobj = {
                                start: req.body.starttime,
                                end: -1,
                                reihenfolge: [],
                                guide: result._id
                            };
                            db.collection("routen").insertOne(myobj, function (err, insertresult) {
                                if (err) throw err;
                                res.send(insertresult.insertedId);
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
            var credentials = req.body.credentials;
            //console.log(req.body);
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
                            //console.log('Route ended:' + result);
                        });
                        db.collection("routen").findOne(myquery, function (err, resultRouten) {
                            if (err) throw err;
                            var difference = parseInt(req.body.endtime) - parseInt(resultRouten.start);
                            //console.log(req.body.endtime + ':' + resultRouten.start);
                            res.send(difference + "");
                        });
                    } else {
                        throw err;
                    }
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
        res.send('-1');
    }
});

app.post('/startStation', function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            //console.log(req.body);
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) throw err;
                    if (count > 0) {
                        getStationCount(
                            (count) => {

                                var newvalues = {
                                    $push: {
                                        visited: {
                                            atStart: count,
                                            atEnd: -1,
                                            start: req.body.start,
                                            routenID: req.body.routenID,
                                            end: -1
                                        }
                                    }
                                };

                                var myquery = { name: req.body.stationName };
                                db.collection("stationen").updateOne(myquery, newvalues, function (err, result) {
                                    if (err) throw err;
                                    //console.log('Station gestartet:' + result);



                                    myquery = { _id: ObjectID(req.body.routenID) };
                                    newvalues = {
                                        $push: {
                                            reihenfolge: {
                                                name: req.body.stationName
                                            }
                                        }
                                    };
    
                                    db.collection("routen").updateOne(myquery, newvalues, function (err, result) {
                                        if (err) throw err;

                                        res.send('1');
                                    });

                                });

                                
                            },
                            (err) => {
                                res.send('-1');
                            },
                            req.body.stationName, db);
                    }
                    else {
                        res.send('-1');
                    }
                });
            });
        }
        else {
            res.send('-1');
        }
    } catch (error) {
        console.log('oh no exception');
    }
});


function getStationCount(toCallOnSuccess, toCallOnError, stationName, db) {
    if (stationName == undefined) {
        toCallOnError();
    } else {
        var atStart = -1;

        var myquery = { name: stationName };

        db.collection("stationen").findOne(myquery, function (err, resultStation) {
            if (err) {
                toCallOnError(err);
            } else {
                if (resultStation == undefined || resultStation.visited == undefined) {
                    toCallOnError();
                } else {
                    atStart = resultStation.visited.filter(function (x) { return x.end == -1 }).length;
                    toCallOnSuccess(atStart);
                }
            }
        });
    }
}


app.post('/endStation', function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            //console.log(req.body);
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) { console.log("Error occured(3)"); throw err;}
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd }, function (err, count) {
                    if (err) { console.log("error occured(2)"); throw err; }
                    if (count > 0) {
                        getStationCount(
                            (count) => {
                                var myquery = { name: req.body.stationName, "visited.routenID": req.body.routenID };
                                var newvalues = { $set: { "visited.$.end": req.body.end, "visited.$.atEnd": count } };
                                //console.log(myquery.name + " set end " + req.body.end);
                                db.collection("stationen").update(myquery, newvalues, function (err, result) {
                                    if (err) {
                                        console.log("error occured(1)");
                                        throw err;
                                    } 
                                    //console.log("Sending normal response lines changed: " + result);
                                    res.send('1');
                                    //console.log('Station beendet:' + result);
                                });
                            },
                            (err) => {
                                //todo on error
                                console.log("TODO");
                            },
                            req.body.stationName, db);

                    } else {
                        res.send('FAILED');
                    }
                    //db.close();
                });
            });
        }
        else {
            console.log("No body send!");
        }
    } catch (error) {
        res.send('FAILED');
        console.log('oh no exception');
    }
});

app.post('/getCountOfStations', function (req, res) {
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

                            result.forEach(function (element) {
                                allstationen.push(element);
                            }, this);

                            allstationen = allstationen.filter(filelem => { return filelem.name != "next = generated"; });
                            var extracted = allstationen.map(e =>{
                                var temp_return = {
                                    name: e.name
                                };
                                temp_return.persons = e.visited.filter(f => {
                                    return f.end == -1;
                                }).length;
                                return temp_return;
                            });
                            
                            res.json(extracted);
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

app.listen(3000);
console.log("Server up and running on port 3000");