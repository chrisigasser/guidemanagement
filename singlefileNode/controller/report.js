var mongoUri = 'mongodb://localhost:27017/guidemanagement';
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var jsonexport = require('jsonexport');

//working
exports.getStationReport = function (req, res) {
    res.setHeader('Content-disposition', 'attachment; filename=allRoutes.csv');
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    MongoClient.connect(mongoUri, function (err, db) {
        if (err) throw err;
        db.collection("stationen").find().toArray(function (err, result) {
            if (err) {
                throw "Could not access the table in the database"
            }
            var allstationen = [];
            result.forEach(function (element) {
                allstationen.push(element);
            }, this);

            allstationen = allstationen.map(statmapelem => {
                var statretelem = {};
                statretelem.name = statmapelem.name;
                statretelem.desc = statmapelem.desc;
                statretelem.maxPeople = statmapelem.visited.map(innermapelem => {
                    return (innermapelem.atEnd > innermapelem.atStart) ? innermapelem.atEnd : innermapelem.atStart;
                }).reduce(function(acc,curval){
                    if(curval>acc)
                        return curval;
                    else
                        return acc;
                },0);
                statretelem.avgPeople = Math.round(statmapelem.visited.map(innermapelem => {
                        return (innermapelem.atEnd > innermapelem.atStart) ? innermapelem.atEnd : innermapelem.atStart;
                    }).reduce(function(acc,curval){
                        return acc+curval;
                    },0)
                    /statmapelem.visited.length);
                return statretelem;
            });

            jsonexport(allstationen, { rowDelimiter: ';' }, function (err, csv) {
                if (err) return console.log(err);
                //csv = csv.replace(",",";");
                res.write(csv);
                res.end();
            });
        });
    });
}

//working
exports.getRouteReport = function (req, res) {
    res.setHeader('Content-disposition', 'attachment; filename=allRoutes.csv');
    res.setHeader('Content-type', 'text/plain');
    res.charset = 'UTF-8';
    MongoClient.connect(mongoUri, function (err, db) {
        if (err) throw err;
        db.collection("routen").find().toArray(function (err, result) {
            if (err) {
                throw "Could not access the table in the database"
            }
            var allRoutes = [];
            result.forEach(function (element) {
                allRoutes.push(element);
            }, this);
            allRoutes = allRoutes.map(mapelem => {
                var toret = {};
                toret.start = mapelem.start;
                toret.end = mapelem.end;
                toret.duration = mapelem.end - mapelem.start;
                toret.visited = mapelem.reihenfolge.length;
                return toret;
            }).filter(filelem => {
                return filelem.end != -1;
            });
            jsonexport(allRoutes, { rowDelimiter: ';' }, function (err, csv) {
                if (err) return console.log(err);
                //csv = csv.replace(",",";");
                res.write(csv);
                res.end();
            });
        });
    });

}

