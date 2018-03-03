var baseURL = "http://192.168.8.146:3000";

var credentialObject = undefined;
var app = angular.module('myApp', ['ngRoute', 'ngCookies']);


app.factory('LoginCookieService', ["$cookies", "$http", function ($cookies, $http) {
    return {
        tryLoadOfCookie: function (success, error, callBeforeRequest) {
            credentialObject = $cookies.get("cred");
            if (credentialObject != undefined) {
                try {
                    credentialObject = JSON.parse(credentialObject);
                    if (callBeforeRequest != undefined)
                        callBeforeRequest();

                    $http.post(baseURL + "/checkAuthentificationAdmin", credentialObject)
                    .then(success, error);
                }
                catch (error) {
                    console.log(error);
                }
			}
        }
    };
}]);



app.controller('myCtrl', ['LoginCookieService',"$scope", "$http", "$timeout", "$location", "$cookies", function (LoginCookieService, $scope, $http, $timeout, $location, $cookies) {
    LoginCookieService.tryLoadOfCookie(
        (response) => {
            if (response.data != "PASSED") {
                alert("invalid pwd");
            }
        },
        (response) => {
            alert("not reachable");
           alert("Error occured during contacting server; Code: " + response.status);
        },
        () => {
            console.log("Probiere automatisches Login");
        }
        );
    
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
}]);
