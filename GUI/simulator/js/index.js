var app = angular.module('myApp', []);
var baseURL = "http://localhost:3000";
var nameOfStationWhichIsUsedForGenerateStation = "next = generated";

var credentialObject = null;

app.controller('myCtrl', ["$scope", "$http", "$timeout", function ($scope, $http, $timeout) {
    
}]);

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}