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
                var averageP = ((element.atStart + element.atEnd)/2);
                averageP = Math.round(averageP);
                var waitingTime = (element.end - element.start);
                if(!peopleWithAVGWaitingTime.some( e => e.people==averageP)){
                    peopleWithAVGWaitingTime.push({
                        people: averageP,
                        waitingtimes: [waitingTime]
                    })
                }
                else{
                    var idx = peopleWithAVGWaitingTime.findIndex(idxelement => idxelement.people == averageP);
                    peopleWithAVGWaitingTime[idx].waitingtimes.push(waitingTime);
                }
            }
        });
        peopleWithAVGWaitingTime = peopleWithAVGWaitingTime
        .sort((a,b)=>a.people-b.people)
        .map(val=>{
            var avgt = (val.waitingtimes.reduce((pv, cv) => pv+cv, 0) / val.waitingtimes.length);
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