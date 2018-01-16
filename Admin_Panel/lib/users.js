var baseURL = "http://192.168.137.181:3000";

var credentialObject = {credentials: {username: "admin", pwd: "6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c"}};
var app = angular.module('myApp', []);






app.controller('myCtrl', function($scope, $http) {
    $scope.allGuides = [];
    
    $scope.getData = function() {
        console.log("Fetching data");
        $http.post(baseURL + "/getGuides", credentialObject)
        .then(
            function mySuccess(response) {
                $scope.allGuides = response.data;
            },
            function myError(response) {
                alert("Error on contacting server!");
                setTimeout(getData, 200);
            }
        );
    }

    $scope.generateNewOnes = function() {
        $scope.allGuides = []
        console.log("Getting new ones");
        var newObject = cloneCredentialsObject();
        newObject.count = 200;
        $http.post(baseURL + "/generateGuides", newObject)
        .then(
            function mySuccess(response) {
                if(response.data == "OK") {
                    setTimeout($scope.getData, 1000);
                }
                else {
                    alert("Error on server");
                }
            },
            function myError(response) {
                alert("Error on contacting server!");
            }
        );
    }
});

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}