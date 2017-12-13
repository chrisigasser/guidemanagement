var app = angular.module('myApp', []);
var baseURL = "http://localhost:3000";
var nameOfStationWhichIsUsedForGenerateStation = "next = generated";

var credentialObject = null;

var allRouteWorkers = [];

app.controller('myCtrl', ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    $scope.startNewRouteWorker = function() {
        var newRouteWorker = new Worker('/pre/simulator/js/newRouteWorker.js');
        newRouteWorker.onmessage = function(data) {
            console.log("Got message from newRouteWorker: " + data.data);
        }
        newRouteWorker.postMessage("start");
    }
}]);

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}