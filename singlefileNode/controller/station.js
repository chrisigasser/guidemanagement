var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var Balancer = require('../loadbalancer');

exports.startStation = function (req, res) {
    try {
        if (req.body != undefined && req.body.routenID!=undefined && req.body.routenID.length == 24) {
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
                        res.status(401);
                        res.send('FAILED');
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
}
exports.endStation = function (req, res) {
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
}

exports.getstation = function (req, res) {
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
                            //checkIfPanic(pe=>{
                                var toreturn = Balancer.findRecommended(withCurCount, 2, !true);
                                toreturn = toreturn.map(mapelem => {
                                    return mapelem.id;
                                });
                                res.send(toreturn);
                            /*},npe=>{
                                var toreturn = Balancer.findRecommended(withCurCount, 2, false);
                                toreturn = toreturn.map(mapelem => {
                                    return mapelem.id;
                                });
                                res.send(toreturn);
                            },db);*/
                            //console.log(withCurCount);
                            
                        });
                    } else {
                        res.send("FAILED");
                    }
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
    }
}

exports.getCountOfStations = function (req, res) {
    try {
        allstationen = [];
        if (req.body != undefined) {
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
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
                                    name: e.name,
                                    x: e.x,
                                    y: e.y
                                };
                                temp_return.persons = e.visited.filter(f => {
                                    return f.end == -1;
                                }).length;
                                return temp_return;
                            });
                            
                            res.json(extracted);

                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
    }
}

exports.getstations = function (req, res) {
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
}

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
function checkIfPanic(panicModeOn,panicModeOff, db) {
        db.collection("panic").find({}, function (err, resultPanic) {
            if (err) {
                panicModeOff("random");
            } else {
                var panic = [];
                resultPanic.forEach(function (element) {
                        panic.push(element);
                    }, this);
                panic = panic.sort(function(a,b) {
                    return a.time-b.time;
                });
                var dif;
                var ispanic = false;
                for(i=0;i<(panic.length-1); i++){
                    dif = panic[i] - panic[i+1];

                    if(dif<0)
                        dif=dif*-1;
                    
                    if(dif>0&&dif<10){
                        ispanic = true;
                    }
                }
                if(ispanic)
                    panicModeOn();
                else
                    panicModeOff();
            }
        });
    }
