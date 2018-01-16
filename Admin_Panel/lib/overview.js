var baseURL = "http://192.168.137.181:3000";
var heatmapInstance;
var maxToSet = 15;
var data = [
    { x: 239, y: 144, value: 5, name: "Arduino"},
    { x: 890, y: 150, value: 10, name: "Diplomarbeiten"},
    { x: 1067, y: 441, value: 0, name: "Sharepoint"},
    { x: 915, y: 667, value: 0, name: "App corner"},
    { x: 245, y: 670, value: 0, name: "Videowall"},
];
var credentialObject = {credentials: {username: "admin", pwd: "6a2200b0cc85d41f7e0d6e3194dc8f04eabb3a3f6d891b7c2c8b072787c0d80c"}};
var app = angular.module('myApp', []);






app.controller('ht_ctrl', function($scope, $http) {
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
});



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