var myRoute = undefined;
var serverURL = undefined;
var credentialObject = undefined;
var runningStation = undefined;

onmessage = function(data) {
    switch(data.data.type) {
        case "init":
            myRoute = data.data.route;
            log("New routeworker running");
            break;
        case "init server":
            serverURL=data.data.value;
            log("Server URL set");
            break;
        case "init credentials":
            credentialObject = data.data.value;
            log("credentials arrived");
            break;
        case "run":
            start();
            log("Starting simulating to run around!");
            break;
        case "station start":
            startAtStation(data.data.station, data.data.duration);
            log("Starting at station: " + data.data.station);
            break;
    }
}

function start() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.status == 200) {
                var message = JSON.parse(this.responseText);
                if(message.length == 0) {
                    finishRoute();
                }
                else {
                    //var message = JSON.parse(this.responseText);
                    gotoStation(message[0]);
                }
            }
            else {
                console.log("******ERROR********");
                log("at start");
                log("Response: " + this.responseText);
                console.log(this);
                log("******END**********");
            }
        }
    };
    xhttp.open("POST", serverURL+"/getStation", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var obj = cloneCredentialsObject();
    obj.runningRoute = myRoute.id;
    xhttp.send(JSON.stringify(obj));
}

function gotoStation(stationName) {
    postMessage({type: "station question", station: stationName});
}

function startAtStation(stationName, dauer) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.status == 200) {
                if(this.responseText == "1") {
                    runningStation = stationName;
                    postMessage({type: "station start", station: stationName});
                    log("Currently at station: " + runningStation);
                    setTimeout(finishStation, dauer*1000);
                }
                else {
                    console.log("******ERROR********");
                    log("at startAtStation");
                    log("Response != 1: " + this.responseText);
                    console.log(this);
                    log("******END**********");
                }
            }
            else {
                console.log("******ERROR********");
                log("at startAtStation");
                log("Response: " + this.responseText);
                console.log(this);
                log("******END**********");
            }
        }
    };
    xhttp.open("POST", serverURL+"/startStation", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var obj = cloneCredentialsObject();
    obj.routenID = myRoute.id;
    obj.stationName = stationName;
    obj.start = Math.round(new Date().getTime() / 1000);
    xhttp.send(JSON.stringify(obj));
}

function finishStation() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.status == 200) {
                if(this.responseText == "1") {
                    postMessage({type: "station stop", station: runningStation});
                    log("Finished at station: " + runningStation);
                    runningStation = undefined;
                    setTimeout(start, 1000); //change here timeout between each start of station = timeout to walk to station
                }
                else {
                    postMessage({type: "alert", value: "Failed to finish station"});
                    console.log("******ERROR********");
                    log("at finishStation");
                    log("Response != 1: " + this.responseText);
                    console.log(this);
                    log("******END**********");
                }
            }
            else {
                console.log("******ERROR********");
                log("at finishStation");
                log("Response: " + this.responseText);
                console.log(this);
                log("******END**********");
            }
        }
    };
    xhttp.open("POST", serverURL+"/endStation", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var obj = cloneCredentialsObject();
    obj.routenID = myRoute.id;
    obj.stationName = runningStation;
    obj.end = Math.round(new Date().getTime() / 1000);
    xhttp.send(JSON.stringify(obj));
}

function finishRoute() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.status == 200) {
                var message = this.responseText;
                postMessage({type: "route finished", routeID: myRoute.id});
            }
            else {
                console.log("******ERROR********");
                log("at finishRoute");
                log("Response: " + this.responseText);
                console.log(this);
                log("******END**********");
            }
        }
    };
    xhttp.open("POST", serverURL+"/endRoute", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var obj = cloneCredentialsObject();
    obj.id = myRoute.id;
    obj.endtime = Math.round(new Date().getTime() / 1000);
    xhttp.send(JSON.stringify(obj));
}

function log(message) {
    console.log("routeWorker from route: " + myRoute.id + " :      " + message);
}

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}