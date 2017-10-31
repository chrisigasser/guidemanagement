var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http, $timeout) {
	$scope.checkLogin = function() {
		$http({
			method : "GET",
			url : "http://localhost/checkAuthentification.html?username=asdf&pwd=abc"
		}).then(function mySuccess(response) {
			if(response.data != "PASSED") {
				$scope.auth_msg = "INVALID";
			}
			else {
				alert("open next");
			}
		}, function myError(response) {
			$scope.auth_msg = "Error occured during contacting server; Code: " + response.status;
		});
	}
});