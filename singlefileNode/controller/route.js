var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

exports.newRoute = function (req, res) {
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
}

exports.endRoute = function (req, res) {
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
}