var stationElements = [
    {
        "name" : "Arduino",
        "waitingTime": 2,
        "workingTime": 10,
        "maxPeople": 3,
        "current": 0
    },
    {
        "name" : "Sharepoint",
        "waitingTime": 3,
        "workingTime": 8,
        "maxPeople": 2,
        "current": 0
    },
    {
        "name" : "Diplomarbeiten",
        "waitingTime": 6,
        "workingTime": 15,
        "maxPeople": 5,
        "current": 0
    },
	{
        "name" : "Videowall",
        "waitingTime": 3,
        "workingTime": 7,
        "maxPeople": 2,
        "current": 0
    },
	{
        "name" : "App corner",
        "waitingTime": 5,
        "workingTime": 10,
        "maxPeople": 15,
        "current": 0
    }
];



var app = angular.module('myApp', []);
var serverURL = "http://localhost:3000";
var baseURL = "/pre/simulator";

var credentialObject = {credentials: {username: "guide", pwd: "6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c"}};

var newRouteWorker = undefined;



app.controller('myCtrl', ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.ankunft = 5;

    $scope.runningStations = 0;
    $scope.runningRoutes = 0;
    $scope.alrFinishedRoutes = 0;

    $scope.stopNewRouteWorker = function() {
        if(newRouteWorker != undefined) {
            newRouteWorker.terminate();
        }
    }

    $scope.startNewRouteWorker = function() {

        newRouteWorker = new Worker(baseURL+'/js/newRouteWorker.js');
        sendNewAnkunftToWorker($scope.ankunft);
        sendServerURLToWorker(serverURL);
        sendCredentialsToWorker(credentialObject);
        
        newRouteWorker.onmessage = function(data) {
            switch(data.data.type) {
                case "newRoute":
                    var rWorker = new Worker(baseURL+"/js/routeWorker.js");
                    rWorker.onmessage = onMessageRouteWorker;
                    rWorker.postMessage({type: "init", route: data.data.route});
                    rWorker.postMessage({type: "init server", value: serverURL});
                    rWorker.postMessage({type: "init credentials", value: credentialObject});
                    rWorker.postMessage({type: "run"});
                    $scope.$apply(() => {
                        $scope.runningRoutes+=1;
                    });
                    break;
            }
        }
        newRouteWorker.postMessage({type: "start"});
    }

    function onMessageRouteWorker(data) {
        switch(data.data.type) {
            case "route finished":
                $scope.$apply(() => {
                    $scope.runningRoutes-=1;
                    $scope.alrFinishedRoutes += 1;
                });
                console.log("Route finished successful!");
                break;
            case "station question":
                var delay = getDelayForStation(data.data.station);
                data.srcElement.postMessage({type: "station start", station: data.data.station, duration: delay});
                break;
            case "station start":
                $scope.$apply(() => {
                    $scope.runningStations+=1;
                });
                addPersonToStation(data.data.station);
                break;
            case "station stop":
                $scope.$apply(() => {
                    $scope.runningStations-=1;
                });
                removePersonFromStation(data.data.station);
                break;
            case "alert":
                alert(data.data.value);
                break;
        }
    }

    function getDelayForStation(stationName) {
        var stationEl = stationElements.find((e) => {return e.name == stationName});
        var time = stationEl.workingTime; //change here for change in time of station
        time += parseInt(parseInt(stationEl.current)/parseInt(stationEl.maxPeople)) * parseInt(stationEl.waitingTime);
        return time;
    }

    function addPersonToStation(stationName) {
        stationElements.forEach((e) => {
            if(e.name == stationName) {
                e.current++;
                console.log("Added Person to station!");
            }
        });
    }

    function removePersonFromStation(stationName) {
        stationElements.forEach((e) => {
            if(e.name == stationName) {
                e.current--;
                console.log("Removed Person to station!");
            }
        })
    }

    $scope.setNewAnkunft = function() {
        if(newRouteWorker != undefined) {
            sendNewAnkunftToWorker($scope.ankunft);
        }
    }

    function sendNewAnkunftToWorker(newValue) {
        newRouteWorker.postMessage({type: "ankunft", value: newValue});
    }
    function sendServerURLToWorker(url) {
        newRouteWorker.postMessage({type: "init server", value: url});
    }
    function sendCredentialsToWorker(cred) {
        newRouteWorker.postMessage({type: "init credentials", value: cred});
    }

    function postFunction(relativeURL, obj, success, error) {
        $http.post(relativeURL, obj)
        .then(
            function mySuccess(response) {
                success(response);
            },
            function myError(response) {
                error(response);
            }
        );
    }
}]);

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}