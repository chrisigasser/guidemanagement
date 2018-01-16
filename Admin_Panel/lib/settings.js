var baseURL = "http://192.168.137.181:3000";

var credentialObject = {credentials: {username: "admin", pwd: "6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c"}};
var app = angular.module('myApp', []);






app.controller('myCtrl', function($scope, $http) {
    $scope.allGuides = [];
    
    $scope.panicPanicPanic = function() {
        console.log("Fetching data");
        $http.post(baseURL + "/ohShitMyBallz", credentialObject)
        .then(
            function mySuccess(response) {
                alert(response.data);
            },
            function myError(response) {
                alert("ERROR");
            }
        );
    }
});