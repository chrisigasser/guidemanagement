var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

exports.checkAuthentication = function (req, res) {
    try {
        if (req.body != undefined) {
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
}
exports.checkAuthenticationAdmin = function (req, res) {
    try {
        if (req.body != undefined) {
            var credentials = req.body.credentials;
            MongoClient.connect(mongoUri, function (err, db) {
                if (err) throw err;
                db.collection("users").count({ username: credentials.username, pwd: credentials.pwd , role: 'admin' }, function (err, count) {
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
}