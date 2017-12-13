var myRoute = undefined;
var serverURL = undefined;
var credentialObject = undefined;

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
    }
}

function start() {
    for(var i = 0; i < 10000; i ++) {
        console.log("hi there");
    }
    finishRoute();
}

function finishRoute() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.status == 200) {
                var message = this.responseText;
                if(message == "1") {
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