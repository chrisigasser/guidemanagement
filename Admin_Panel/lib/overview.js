var baseURL = "http://192.168.137.189:3000";
var heatmapInstance;
var maxToSet = 15;
var data = [
    { x: 193, y: 111, value: 5, name: "Arduino"},
    { x: 650, y: 115, value: 10, name: "Diplomarbeiten"},
    { x: 777, y: 320, value: 0, name: "Sharepoint"},
    { x: 674, y: 480, value: 0, name: "App corner"},
    { x: 169, y: 480, value: 0, name: "Videowall"},
];
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


app.controller('ht_ctrl', ['LoginCookieService',"$scope", "$http", "$timeout", "$location", "$cookies", function (LoginCookieService, $scope, $http, $timeout, $location, $cookies) {
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
    
    $scope.stationCount = [];
    var pidata = [{
        type: "pie",
        startAngle: 240,
        yValueFormatString: "##0",
        indexLabel: "{label} {y}",
        dataPoints: [
            {y: 0, label: "frei"},
            {y: 0, label: "belegt"}
        ]
    }];

    $scope.guidesFrei = 0;
    $scope.guidesBelegt = 0;
    
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        data: pidata
    });

    $scope.init = function() {
        generate();
        getData();
        getGuides();
    }
    function getData() {
        console.log("Fetching data");
        $http.post(baseURL + "/getCountOfStations", credentialObject)
        .then(
            function mySuccess(response) {
                console.log(response.data);
                var data = response.data;
                data.forEach((e) => {
                    changeData(e.name, e.persons);
                });
                $scope.stationCount = response.data;
                setData();
                setTimeout(getData, 400);
            },
            function myError(response) {
                console.log("Error on contacting server!");
                setTimeout(getData, 200);
            }
        );
    }

    function getGuides() {
        $http.post(baseURL + "/guideAuslastung", credentialObject)
        .then(
            function mySuccess(response) {
                console.log(response.data);
                var data = response.data;
                

                pidata[0].dataPoints[0].y = data.frei;
                pidata[0].dataPoints[1].y = data.belegt;

                $scope.guidesFrei = data.frei;
                $scope.guidesBelegt = data.belegt;
                chart.render();

                setTimeout(getGuides, 400);
            },
            function myError(response) {
                console.log("Error on contacting server!");
                setTimeout(getGuides, 200);
            }
        );
    }
}]);



function onStart() {
    generate();
    start();
}

function generate() {
    heatmapInstance = h337.create({
        container: document.getElementById('heatMap'),
        radius: 400
    });

    
    heatmapInstance.setData({
        max: maxToSet,
        data: []
    });
}
function changeData(name, value) {
    console.log(value + " in " + name);
    var ob = data.find((e) => {
        return e.name == name
    });
    ob.value = value;
}

function setData() {
    heatmapInstance.setData({max: maxToSet, data: data});
}


/* 


window.onload = function() {

var pidata = [{
		type: "pie",
		startAngle: 240,
		yValueFormatString: "##0",
		indexLabel: "{label} {y}",
		dataPoints: [
			{y: 120, label: "frei"},
			{y: 70, label: "belegt"}
		]
	}];

var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	data: pidata
});

x();

function x() {
chart.render();
pidata[0].dataPoints[0].y++;
console.log(pidata[0].dataPoints[0].y);
setTimeout(x, 1000);
}


}


*/