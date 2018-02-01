var baseURL = "http://192.169.2.253:3000";

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
        newObject.count = 300;
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
}]);

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}