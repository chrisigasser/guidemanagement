exports.extractInfo = function (jsonArray) {
    var extracted = [];
    jsonArray.forEach(outerelement => {
        var cur = {
            id: outerelement.name,
            waitingtimes: []
        };
        var peopleWithAVGWaitingTime = [];
        outerelement.visited.forEach(element => {
            if (element.atStart >= 0 && element.atEnd >= 0) {
                var averageP = ((element.atStart + element.atEnd) / 2);
                averageP = Math.round(averageP);
                var waitingTime = (element.end - element.start);
                if (!peopleWithAVGWaitingTime.some(e => e.people == averageP)) {
                    peopleWithAVGWaitingTime.push({
                        people: averageP,
                        waitingtimes: [waitingTime]
                    })
                }
                else {
                    var idx = peopleWithAVGWaitingTime.findIndex(idxelement => idxelement.people == averageP);
                    peopleWithAVGWaitingTime[idx].waitingtimes.push(waitingTime);
                }
            }
        });
        peopleWithAVGWaitingTime = peopleWithAVGWaitingTime
            .sort((a, b) => a.people - b.people)
            .map(val => {
                var avgt = (val.waitingtimes.reduce((pv, cv) => pv + cv, 0) / val.waitingtimes.length);
                return {
                    people: val.people,
                    waitingtimes: val.waitingtimes,
                    avgwaitingtime: avgt
                };
            });

        cur.waitingtimes = peopleWithAVGWaitingTime;
        extracted.push(cur);
    });
    return extracted;
}
exports.findRecommended = function (jsonArray, numberOfStationsToBeLoaded) {
    console.log(jsonArray);
    var stationsFreeSpots;
    stationsFreeSpots = jsonArray.map(e => {
        var toadd = e;
        e.difference = getMaxPeopleForStation(e.waitingtimes) - e.curpeople;
        return toadd;
    });
    stationsFreeSpots = stationsFreeSpots.sort((a, b) => {
        if(a.people==b.people)
            return a.curpeople - b.curpeople;
        else if (a.people==0)
            return -1;
        else if(b.people==0)
            return 1;
        else
            return a - b;
    })
    console.log(stationsFreeSpots);
    stationsFreeSpots = stationsFreeSpots.splice(0, numberOfStationsToBeLoaded);
    return stationsFreeSpots;
}
function getMaxPeopleForStation(objectToConsider) {
    if (objectToConsider.length <= 0) return -1;

    var maxPeople = 1;
    var avgTimeSum = objectToConsider[0].avgwaitingtime;
    var maxChangeTime = Math.pow(avgTimeSum / 3, 2);

    for (var i = 1; i < objectToConsider.length; i++) {
        if (objectToConsider[i].avgwaitingtime - (avgTimeSum / i) >= maxChangeTime) {
            maxPeople = objectToConsider[i].people;
            break;
        }
        avgTimeSum += objectToConsider[i].avgwaitingtime;
    }
    return maxPeople - 1;
}