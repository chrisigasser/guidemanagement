var baseURL = "http://192.168.137.189:3000";

var credentialObject = undefined;
var baseLocation = "/admin";
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
            else {
                loadMainPage();
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
    
    	$scope.checkLogin = function() {
            var c = new Crypt();
            var un = $scope.txt_user
            var hPW = c.HASH.sha256($scope.txt_pwd).toString();
            credentialObject = {"credentials": {"username": un, "pwd": hPW }};
            console.log(credentialObject);
            
            
            $http.post(baseURL + "/checkAuthentificationAdmin", credentialObject)
                .then(
                    function mySuccess(response) {
                        if(response.data != "PASSED") {
                            alert("invalid pwd");
                        }
                        else {
                            $cookies.put("cred", JSON.stringify(credentialObject));
                            loadMainPage();
                        }
                    },
                    function myError(response) {
                        alert("not reachable");
                    }
                );
        }
        
        function loadMainPage() {
            location.href = baseLocation+"/index.html";
        }
   
}]);

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}