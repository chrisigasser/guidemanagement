var app = angular.module('myApp', ["ngRoute"]);
var baseURL = "http://192.168.194.156:3000";

var un;
var hPW;

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



app.controller('loginController', function($scope, $http, $timeout, $location) {
	$scope.checkLogin = function() {
		var c = new Crypt();
		un = $scope.txt_user
		hPW = c.HASH.sha256($scope.txt_pwd).toString();
		var dataObj = {"credentials": {"username": un, "pwd": hPW }};
		
		
		$http.post(baseURL+"/checkAuthentification", dataObj)
			.then(
				function mySuccess(response) {
					if(response.data != "PASSED") {
						$scope.auth_msg = "INVALID";
					}
					else {
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
});


app.controller('overviewController', function($scope, $http, $timeout, $location) {
	loadStations();

	function loadStations() {
	var dataObj = {"credentials": {"username": un, "pwd": hPW }};
	$http.post(baseURL+"/getStations", dataObj)
		.then(
			function mySuccess(response) {
			    var allStations = response.data;
				$scope.allStations = allStations;

                /*
				$scope.selectedStation = allStations[1];
				setAttributesOfStation(allStations[0]);
				removeStation(allStations[0]);*/
			},
			function myError(response) {
				alert("Error retrieving Stations");
				console.log(response);
			}
		);
	}
	
	$scope.update = function () {
	    var station = $scope.selectedStation;
	    if (station.name == "next = generated") {
	        alert("hole generierte station");
	    }
	    else {
	        setAttributesOfStation(station);
	        removeStation(station);
	    }
	}

	$scope.startRoute = function () {
	    //TODO: send to server


	}
	
	function setAttributesOfStation(station) {
		$scope.akt_title = station.name;
		$scope.akt_desc = station.desc;
	}
	
	function removeStation(toRemove) {
		var newArray = [];
		$scope.allStations.forEach((elem) => {
			if(elem.name != toRemove.name) {
				console.log(elem);
				newArray.push(elem);
			}
		});
		$scope.allStations = newArray;
	}
});