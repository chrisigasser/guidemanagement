var timeSpan = 60;
var ankuft = 5;
var rate = timeSpan / ankuft;

var serverURL = undefined;
var credentialObject = undefined;
var postFunction = undefined;

onmessage = function(data) {
    switch(data.data.type) {
        case "ankunft":
            log("Neue Ankuftsrate");
            setNewAnkunfsrate(data.data.value);
            break;
        case "start":
            log("Starte Routengenerierung");
            generateRoutes();
            break;
        case "init server":
            serverURL=data.data.value;
            log("Server URL set");
            break;
        case "init credentials":
            credentialObject = data.data.value;
            log("credentials arrived");
            console.log(credentialObject);
            break;
    }
}

function setNewAnkunfsrate(newValue) {
    ankunft = newValue;
    rate = timeSpan / ankunft;
}

function log(message) {
    console.log("newRouteWorker:      " + message)
}

function generateRoutes() {
    var nextDelay = getNextNorm();
    setTimeout(generateRoutes, nextDelay*1000);
    startRoute();
}

function startRoute() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.status == 200) {
                var routeID = this.responseText;
                routeID = routeID.replace(/\"/g, "");
                postMessage({type: "newRoute", route: { id: routeID}});
            }
            else {
                console.log("******ERROR********");
                log("at startRoute");
                log("Response: " + this.responseText);
                console.log(this);
                log("******END**********");
            }
        }
    };
    xhttp.open("POST", serverURL+"/newRoute", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var obj = cloneCredentialsObject();
    obj.starttime = Math.round(new Date().getTime() / 1000);;
    xhttp.send(JSON.stringify(obj));

}


function getNextNorm() {
    var delay = (-Math.log(Math.random())/rate);
    if(Math.floor((Math.random() * 2)-1) == 0)
        delay *= -1;
    delay *= ankuft;
    
    delay += rate;
    if(delay > rate*2 || delay < 0)
        return getNextNorm();
    
    return delay;
}

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}