var app = angular.module('myApp', ['ngRoute', 'ngCookies']);
var baseURL = "http://192.169.2.253:3000";
//var baseURL = "http://192.168.137.192:3000";
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

app.config(function ($sceProvider) {
    $sceProvider.enabled(false);
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
                $scope.auth_msg = "INVALID or NO Cookie Found";
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
		console.log(credentialObject);
		
		
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
	$scope.vis_nextStation = {'visibility' : 'hidden'};
    $scope.btnRouteStartStop = "Fuehrung starten";
    $scope.btnStationStartStop = "Mit Station beginnen";
	$scope.loggedIn = false;
	$scope.generated = "loading";
	$scope.nextStation_name = $scope.generated;
	$scope.infoStations = [];
    
    var started = false;
    var stationStarted = false;

    if (credentialObject == undefined) {
		if($cookies.get("cred") == undefined) {
			$location.url("/");
		}
		else {
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
	}
    else {
		loggedInSucess();
    }

    function loggedInSucess() {
        $scope.loggedIn = true;
        checkForRunningRoute();
    }

    function checkForRunningRoute() {
        var runningRoute = $cookies.get("runningRoute");
        if (runningRoute != undefined) {
            $scope.route_name = runningRoute;
			$scope.vis_station_view = { 'visibility': 'visible' };
			$scope.vis_nextStation = {'visibility' : 'visible'};
            $scope.btnRouteStartStop = "Fuehrung beenden";
			started = true;
			loadStations(runningRoute);
		}
		else {
			loadStations();
		}
    }

    function checkForRunningStation() {
        var runningStation = $cookies.get("runningStation");
        if (runningStation != undefined) {
			setAttributesOfStation(runningStation);
			removeStation(runningStation);
			setStandartSelectionAndGetCalculatedStation();
            stationStarted = true;
			$scope.btnStationStartStop = "Station beenden";
			$scope.vis_nextStation = {'visibility' : 'hidden'};
        }
    }

	function loadStations(rRoute) {
		var credObject = cloneCredentialsObject();
		credObject.runningRoute = rRoute;
	    $http.post(baseURL+"/getStations", credObject)
		    .then(
			    function mySuccess(response) {
			        var allStations = response.data;
					$scope.allStations = allStations;
					setStandartSelectionAndGetCalculatedStation()
			        checkForRunningStation();
			    },
			    function myError(response) {
				    alert("Error beim holen der Informationen");
				    console.log(response);
			    }
		    );
	}

	$scope.selectedStationChanged = function () {
		if($scope.allStations.length == 1) {
			$scope.nextStation_name = "Keine Stationen mehr!";
		}
		else {
			var station = $scope.selectedStation;
			if (station.name == nameOfStationWhichIsUsedForGenerateStation) {
				$scope.nextStation_name = "loading";
				loadNextGeneratedStation();
			}
			else {
				$scope.nextStation_name = station.name;
			}
		}
	}

	$scope.loadInfoData = function() {
		$scope.infoStations = [];
		var credObject = cloneCredentialsObject();
		$http.post(baseURL+"/getStations", credObject)
		.then(
			function mySuccess(response) {
				var x = response.data.filter((ob) => {return ob.name != nameOfStationWhichIsUsedForGenerateStation});
				$scope.infoStations = x;
			},
			function myError(response) {
				alert("Error beim Anzeigen der Informationen");
				console.log(response);
			}
		);
	}
	
	$scope.update = function () {
	    var stationName = $scope.nextStation_name;
	    var seconds = Math.round(new Date().getTime() / 1000);

	    if (!stationStarted) {
	        if(stationName == undefined || stationName == "Keine Stationen mehr!") {
				alert("Deine Führung ist bereits fertig!");
			} 
			else {
				var sendObject = cloneCredentialsObject();
				sendObject.start = seconds;
				sendObject.routenID = $scope.route_name;
				sendObject.stationName = stationName;
				$scope.vis_nextStation = {'visibility' : 'hidden'};
	
				$http.post(baseURL + "/startStation", sendObject)
				.then(
					function mySuccess(response) {
						if (response.data == "1") {
							$cookies.put("runningStation", stationName);
							setAttributesOfStation(stationName);
							removeStation(stationName);
							setStandartSelectionAndGetCalculatedStation();
							$scope.nextStation_name = "";
							$scope.btnStationStartStop = "Station beenden";
						}
						else {
							alert("Server error: " + response.data);
						}
					},
					function myError(response) {
						alert("Error beim Starten der Station");
						console.log(response);
					}
				);
				stationStarted = true;
			}
	    }
	    else {
	        var sendObject = cloneCredentialsObject();
	        sendObject.end = seconds;
	        sendObject.routenID = $scope.route_name;
			sendObject.stationName = $scope.akt_title;
			$scope.vis_nextStation = {'visibility' : 'visible'};


	        $http.post(baseURL + "/endStation", sendObject)
            .then(
                function mySuccess(response) {
                    if (response.data == 1) {
                        $cookies.remove("runningStation");
						$scope.btnStationStartStop = "Mit Station beginnen";
						console.log("Hole neues");
						loadNextGeneratedStation();
                        setAttributesOfStation();
                    }
                    else {
                        alert("Server error: " + response.data);
                    }
                },
                function myError(response) {
                    alert("Error beim Beenden der Station");
                    console.log(response);
                }
            );
			stationStarted = false;
	    }
	}

	function setStandartSelectionAndGetCalculatedStation() {
		$scope.selectedStation = $scope.allStations.find((e) => { return e.name == nameOfStationWhichIsUsedForGenerateStation });
		if($scope.allStations.length == 1) {
			$scope.nextStation_name = "Keine Stationen mehr!";
		}
		else {
			loadNextGeneratedStation();
		}
	}

	function loadNextGeneratedStation() {
		//TODO stability tests
		var sendObject = cloneCredentialsObject();
		sendObject.runningRoute = $scope.route_name;
		if($scope.allStations.length == 1) {
			$scope.nextStation_name = "Keine Stationen mehr!";
		}
		else {
			if($scope.route_name != "No id provided yet") {
				$http.post(baseURL + "/getStation", sendObject)
				.then(
					function mySuccess(response) {
						if(response.data == -1)
							alert("Konnte die generierten Stationen nicht laden! Bitte per Hand auswaehlen!");
						else {
							$scope.generated = response.data;
							if($scope.selectedStation.name == nameOfStationWhichIsUsedForGenerateStation) {
									$scope.nextStation_name = $scope.generated[0];
							}
							console.log("  ");
							console.log("  ");				console.log("  ");				console.log("  ");				console.log("  ");
							console.log("Send Object used:")
							console.log(sendObject);
							console.log("Generated Station arrived");
							console.log("Generated Stations are:");
							console.log(response.data);
							console.log("Done");
							console.log("  ");				console.log("  ");				console.log("  ");				console.log("  ");
						}
					},
					function myError(response) {
						alert("Konnte die generierten Stationen nicht laden!");
						console.log(response);
					}
				);
			}
		}
	}

	$scope.logout = function() {
		if(stationStarted) {
			alert("Bitte zuerst die Station beenden");
		}
		else if(started) {
			alert("Bitte zuerst die Fuehrung beenden");
		}
		else {
			$cookies.remove("cred");
			$location.url("/");
		}
	}

	$scope.startRoute = function () {
	    var seconds = Math.round(new Date().getTime() / 1000);
	    if (!started) {
            var sendObject = cloneCredentialsObject();
            sendObject.starttime = seconds;
			loadStations();
			$scope.vis_nextStation = {'visibility' : 'visible'};
            $http.post(baseURL + "/newRoute", sendObject)
		    .then(
			    function mySuccess(response) {
			        $cookies.put("runningRoute", response.data);
					$scope.route_name = response.data;
					loadNextGeneratedStation();
			    },
			    function myError(response) {
			        alert("Error beim Starten der neuen Fuehrung");
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
	            alert("Bitte zuerst die Station beenden");
	        }
	        else {
	            var sendObject = cloneCredentialsObject();
	            sendObject.endtime = seconds;
				sendObject.id = $scope.route_name;
				$scope.vis_nextStation = {'visibility' : 'hidden'};

	            $http.post(baseURL + "/endRoute", sendObject)
                .then(
                    function mySuccess(response) {
                        if (response.data != "-1") {
                            $scope.route_name = "";
                            $scope.vis_station_view = { 'visibility': 'hidden' };
                            $scope.btnRouteStartStop = "Fuehrung starten";
                            started = false;
                            $cookies.remove("runningRoute");
                        }
                        else {
                            alert("Fuehrung konnte nicht beendet werden! Error!");
                        }
                    },
                    function myError(response) {
                        alert("Error beim Beenden der Fuehrung");
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