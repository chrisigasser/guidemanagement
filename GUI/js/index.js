var app = angular.module('myApp', []);
var baseURL = "http://192.168.191.171:3000";

var un;
var hPW;

var allStations = undefined;

app.controller('myCtrl', function($scope, $http, $timeout) {
	
	$scope.checkLogin = function() {
		var c = new Crypt();
		un = document.getElementById('txt_User').value;
		hPW = c.HASH.sha256(document.getElementById('txt_Password').value);
		//hPW = document.getElementById('txt_Password').value;
		var dataObj = {"credentials": {"username": un, "pwd": hPW.toString() }};
		
		
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
		$http.get("./parts/overview.html")
			.then(
				function mySuccess(response) {
					document.getElementById('mainDiv').innerHTML = response.data;
					loadStations();
				},
				function myError(response) {
					alert("Error");
				}
			);
	}
	
	function loadStations() {
		var dataObj = {"credentials": {"username": un, "pwd": hPW.toString() }};
		$http.post(baseURL+"/getStations", dataObj)
			.then(
				function mySuccess(response) {
					allStations = response.data;
					var object = allStations[0];
					setValues(object);
					removeStation(object);
					addOptions();
					console.log("added Stations");
				},
				function myError(response) {
					alert("Error retrieving Stations");
					console.log(response);
				}
			);
	}
});

function removeStation(toRemove) {
	var newArray = [];
	allStations.forEach((elem) => {
		if(elem.name != toRemove.name) {
			console.log(elem);
			newArray.push(elem);
		}
	});
	allStations = newArray;
}

function addOptions() {
	var select = document.getElementById('sel_Stations');
	clearOptions(select);
	for(var i = 0; i < allStations.length; i++) {
		var option = document.createElement("option");
		option.text = allStations[i].name;
		select.add(option);
	};
}

function clearOptions(select)
{
	select.selectedIndex = -1;
    for (var i = select.options.length - 1 ; i >= 0 ; i--)
        select.remove(i);
}

function setValues(station) {
	document.getElementById('akt_title').innerHTML = station.name;
	document.getElementById('akt_desc').innerHTML = station.desc;
}

function update() {
	var s = document.getElementById('sel_Stations');
	var nextElem = s.options[s.selectedIndex];
	if(nextElem == undefined) {
		alert("You are done!");
	}
	else {
		var nextName = nextElem.text;
		
		var nextStation = allStations.find((elem) => {return elem.name == nextName});
		console.log(nextStation);
		setValues(nextStation);
		removeStation(nextStation);
		addOptions();
	}
}