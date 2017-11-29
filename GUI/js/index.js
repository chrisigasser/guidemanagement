var app = angular.module('myApp', ['ngRoute', 'ngCookies']);
var baseURL = "http://192.168.137.148:3000";
var nameOfStationWhichIsUsedForGenerateStation = "next = generated";

var credentialObject = null;

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "./parts/login.html",
		controller : "loginController"
    })
    .when("/overview", {
        templateUrl : "./parts/overview.html",
		controller : "overviewController"
    })
});

app.factory('LoginCookieService', ["$cookies", "$http", function ($cookies, $http) {
    return {
        tryLoadOfCookie: function (success, error, callBeforeRequest) {
            credentialObject = $cookies.get("cred");
            if (credentialObject != undefined) {
                try {
                    credentialObject = JSON.parse(credentialObject);
                    if (callBeforeRequest != undefined)
                        callBeforeRequest();

                    $http.post(baseURL + "/checkAuthentification", credentialObject)
                    .then(success, error);
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    };
}]);



app.controller('loginController', ['LoginCookieService',"$scope", "$http", "$timeout", "$location", "$cookies", function (LoginCookieService, $scope, $http, $timeout, $location, $cookies) {
    LoginCookieService.tryLoadOfCookie(
        (response) => {
            if (response.data != "PASSED") {
                $scope.auth_msg = "INVALID Cookie Found";
            }
            else {
                loadMainPage();
            }
        },
        (response) => {
            alert("not reachable");
            $scope.auth_msg = "Error occured during contacting server; Code: " + response.status;
        },
        () => {
            $scope.auth_msg = "Probiere automatisches Login";
        }
        );

	$scope.checkLogin = function() {
		var c = new Crypt();
		var un = $scope.txt_user
		var hPW = c.HASH.sha256($scope.txt_pwd).toString();
		credentialObject = {"credentials": {"username": un, "pwd": hPW }};
		
		
	    $http.post(baseURL + "/checkAuthentification", credentialObject)
			.then(
				function mySuccess(response) {
					if(response.data != "PASSED") {
						$scope.auth_msg = "INVALID";
					}
					else {
					    $cookies.put("cred", JSON.stringify(credentialObject));
					    loadMainPage();
					}
				},
				function myError(response) {
					alert("not reachable");
					$scope.auth_msg = "Error occured during contacting server; Code: " + response.status;
				}
			);
	}
	
	function loadMainPage() {
		$location.url("overview");
	}
}]);


app.controller('overviewController', ['LoginCookieService',"$scope", "$http", "$timeout", "$location", "$cookies", function (LoginCookieService, $scope, $http, $timeout, $location, $cookies) {
    $scope.vis_station_view = { 'visibility': 'hidden' };
    $scope.btnRouteStartStop = "Fuehrung starten";
    $scope.btnStationStartStop = "Mit Station beginnen";
    $scope.loggedIn = false;
    
    var started = false;
    var stationStarted = false;

    if (credentialObject == undefined) {
        LoginCookieService.tryLoadOfCookie(
            (response) => {
                if (response.data != "PASSED") {
                    $location.url("/");
                }
                else {
                    loggedInSucess();
                }
            },
            (response) => {
                alert("not reachable! unable to check if cookie is valid");
            }
            );
    }
    else {
        loggedInSucess();
    }

    function loggedInSucess() {
        $scope.loggedIn = true;
        loadStations();
        checkForRunningRoute();
    }

    function checkForRunningRoute() {
        var runningRoute = $cookies.get("runningRoute");
        if (runningRoute != undefined) {
            $scope.route_name = runningRoute;
            $scope.vis_station_view = { 'visibility': 'visible' };
            $scope.btnRouteStartStop = "Fuehrung beenden";
            started = true;
        }
    }

    function checkForRunningStation() {
        var runningStation = $cookies.get("runningStation");
        if (runningStation != undefined) {
            setAttributesOfStation(runningStation);
            stationStarted = true;
            $scope.btnStationStartStop = "Station beenden";
        }
    }

	function loadStations() {
	    $http.post(baseURL+"/getStations", credentialObject)
		    .then(
			    function mySuccess(response) {
			        var allStations = response.data;
			        $scope.allStations = allStations;
			        $scope.selectedStation = $scope.allStations.find((e) => { return e.name == nameOfStationWhichIsUsedForGenerateStation });
			        checkForRunningStation();
			    },
			    function myError(response) {
				    alert("Error retrieving Stations");
				    console.log(response);
			    }
		    );
	}

	$scope.selectedStationChanged = function () {
	    var station = $scope.selectedStation;
	    if (station.name == nameOfStationWhichIsUsedForGenerateStation) {
	        alert("get generated station");
	    }
	    else {
	        $scope.nextStation_name = station.name;
	    }
	}
	
	$scope.update = function () {
	    var stationName = $scope.nextStation_name;
	    var seconds = Math.round(new Date().getTime() / 1000);

	    if (!stationStarted) {
	        var sendObject = cloneCredentialsObject();
	        sendObject.start = seconds;
	        sendObject.routenID = $scope.route_name;
	        sendObject.stationName = stationName;

	        $http.post(baseURL + "/startStation", sendObject)
		    .then(
			    function mySuccess(response) {
			        if (response.data == "1") {
			            $cookies.put("runningStation", stationName);
			            setAttributesOfStation(stationName);
			            removeStation(stationName);
			            $scope.selectedStation = $scope.allStations.find((e) => { return e.name == nameOfStationWhichIsUsedForGenerateStation })
			            $scope.nextStation_name = "";
			            $scope.btnStationStartStop = "Station beenden";
			        }
			        else {
			            alert("Server responded with " + response.data);
			        }
			    },
			    function myError(response) {
			        alert("Error starting at station");
			        console.log(response);
			    }
		    );
	        stationStarted = true;
	    }
	    else {
	        var sendObject = cloneCredentialsObject();
	        sendObject.end = seconds;
	        sendObject.routenID = $scope.route_name;
	        sendObject.stationName = stationName;

	        $http.post(baseURL + "/endStation", sendObject)
            .then(
                function mySuccess(response) {
                    if (response.data == 1) {
                        $cookies.remove("runningStation");
                        $scope.btnStationStartStop = "Mit Station beginnen";
                        setAttributesOfStation();
                    }
                    else {
                        alert("Server responded with" + response.data);
                    }
                },
                function myError(response) {
                    alert("Error ending station");
                    console.log(response);
                }
            );
	        stationStarted = false;
	    }
	}

	$scope.startRoute = function () {
	    var seconds = Math.round(new Date().getTime() / 1000);
	    if (!started) {
            var sendObject = cloneCredentialsObject();
            sendObject.starttime = seconds;
            
            $http.post(baseURL + "/newRoute", sendObject)
		    .then(
			    function mySuccess(response) {
			        $cookies.put("runningRoute", response.data);
			        $scope.route_name = response.data;

			    },
			    function myError(response) {
			        alert("Error getting new Route");
			        console.log(response);
			    }
		    );

	        $scope.route_name = "No id provided yet";
	        $scope.vis_station_view = { 'visibility': 'visible' };
	        $scope.btnRouteStartStop = "Fuehrung beenden";
	        started = true;
	    }
	    else {
	        if (stationStarted) {
	            alert("Please stop Station first!");
	        }
	        else {
	            var sendObject = cloneCredentialsObject();
	            sendObject.endtime = seconds;
	            sendObject.id = $scope.route_name;

	            $http.post(baseURL + "/endRoute", sendObject)
                .then(
                    function mySuccess(response) {
                        if (response.data != "-1") {
                            $scope.route_name = "";
                            $scope.vis_station_view = { 'visibility': 'hidden' };
                            $scope.btnRouteStartStop = "Fuehrung starten";
                            started = false;
                            $cookies.remove("runningRoute");
                            alert("Deine Fuehrung hat " + response.data + " Sekunden gedauert!");
                        }
                        else {
                            alert("Cannot finish route! Error!");
                        }
                    },
                    function myError(response) {
                        alert("Error finishing Route");
                        console.log(response);
                    }
                );
	        }
	    }

	}
	
	function setAttributesOfStation(stationName) {
	    if (stationName == undefined) {
	        $scope.akt_title = "";
	        $scope.akt_desc = "";
	    }
	    else {
	        var station = $scope.allStations.find((e) => { return e.name == stationName });
	        $scope.akt_title = station.name;
	        $scope.akt_desc = station.desc;
	    }
	}
	
	function removeStation(stationName) {
		var newArray = [];
		$scope.allStations.forEach((elem) => {
			if(elem.name != stationName) {
				newArray.push(elem);
			}
		});
		$scope.allStations = newArray;
	}
}]);

function cloneCredentialsObject() {
    return { "credentials": { "username": credentialObject.credentials.username, "pwd": credentialObject.credentials.pwd } };
}