var app = angular.module('myApp', []);
var serverURL = "http://localhost:3000";
var baseURL = "/pre/simulator";

var credentialObject = {credentials: {username: "guide", pwd: "6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c"}};

var newRouteWorker = undefined;

app.controller('myCtrl', ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.ankunft = 5;

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
                    break;
            }
        }
        newRouteWorker.postMessage({type: "start"});
    }

    function onMessageRouteWorker(data) {
        switch(data.data.type) {
            case "route finished":
                console.log("Route finished successful!");

                break;
        }
    }

    $scope.setNewAnkunft = function() {
        console.log($scope.ankunft);
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