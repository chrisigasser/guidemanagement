var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var randomstring = require("randomstring");
var sha256 = require("sha256");

const unamelength = 5;
const pwdnamelength = 5;

exports.createReport = function (req, res) {
    //todo implement
}
//working
exports.currunningRoutes = function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd, role: 'admin' }, function (err, ucount) {
                    if (err) throw err;
                    if (ucount > 0) {
                        var toreturn = { currentlyRunning: -1 };
                        db.collection("routen").count({ end: -1 }, function (err, count) {
                            if (err) throw err;
                            toreturn.currentlyRunning = count;
                            res.send(toreturn);
                        });
                    } else {
                        res.send('FAILED');
                    }
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
    }
}
exports.curTimeAtStations = function (req, res) {
    //todo implement
}
exports.ohShitMyBallz = function (req, res) {
    //todo implement
}
//working
exports.generateGuides = function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;

            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd, role: 'admin' }, function (err, ucount) {
                    if (err) throw err;
                    if (ucount > 0) {
                        db.collection("users").deleteMany({role: 'guide'}, function (err, r) {
                            if (err) throw err;
                            createRandomUsers(
                                (generatedUsers) => {
                                    db.collection("users").insertMany(generatedUsers, function (err, insertresult) {
                                        if (err) throw err;
                                        res.send("OK");
                                    });
                                },
                                (err) => {

                                },
                                req.body.count,
                                unamelength,
                                pwdnamelength,
                                db
                            );
                          });
                    } else {
                        res.send('FAILED');
                    }
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
        res.send("FAILED");
    }
}
//working
exports.getGuides = function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;

            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd, role: 'admin' }, function (err, ucount) {
                    if (err) throw err;
                    if (ucount > 0) {
                        db.collection("users").find({role: 'guide'}).toArray(function (err, result) {
                            if (err) {
                                throw "Could not access the table in the database"
                            }
                            var allguides = [];
                            result.forEach(function (element) {
                                allguides.push(element);
                            }, this);

                            allguides = allguides.map(
                                mapelem => {
                                    return {username: mapelem.username, pwd: mapelem.pwdblank};
                                }
                            );
                            
                            res.json(allguides);
                        });
                    } else {
                        res.send('FAILED');
                    }
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
        res.send("FAILED");
    }
}
//working
exports.guideAuslastung = function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;

            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd, role: 'admin' }, function (err, ucount) {
                    if (err) throw err;
                    if (ucount > 0) {
                        db.collection("users").count({role: 'guide' }, function (err, gcount) {
                            if (err) throw err;
                            db.collection("routen").count({end:-1}, function (err, rcount) {
                                if (err) throw err;
                                res.send({
                                    belegt: rcount,
                                    frei: gcount-rcount
                                });
                            });
                        });
                    } else {
                        res.send('FAILED');
                    }
                });
            });
        }
    } catch (error) {
        console.log('oh no exception');
        res.send("FAILED");
    }
}

function createRandomUsers(toCallOnSuccess, toCallOnError, numberOfGuidesToBeGenerated,usernameLength,pwdLength, db) {
    if (numberOfGuidesToBeGenerated == undefined || numberOfGuidesToBeGenerated <= 0) {
        toCallOnError();
    } else if (usernameLength == undefined || usernameLength <=1){
        toCallOnError();
    } else if (pwdLength == undefined || pwdLength <=1){
        toCallOnError();
    } else {
        var generatedUsers = [];
        for (i = 0; i < numberOfGuidesToBeGenerated; i++) { 
            var pwd = randomstring.generate(pwdLength);
            generatedUsers.push(
                {
                    "username" : randomstring.generate(usernameLength),
                    "pwd" : sha256(pwd),
                    "pwdblank": pwd,
                    "role" : "guide"
                }
            );
        }
        toCallOnSuccess(generatedUsers);
    }
}