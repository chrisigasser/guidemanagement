var app = angular.module('myApp', []);
var baseURL = "http://192.168.234.133:3000";

app.controller('myCtrl', function($scope, $http, $timeout) {
	$scope.checkLogin = function() {
		var c = new Crypt();
		var dataObj = {username: $scope.txt_User, pwd: c.HASH.sha256($scope.txt_pwd)}
		
		
		$http.post(baseURL+"/checkAuth", dataObj)
			.then(
				function mySuccess(response) {
					if(response.data != "PASSED") {
					$scope.auth_msg = "INVALID";
					}
					else {
						alert("open next");
					}
				},
				function myError(response) {
					$scope.auth_msg = "Error occured during contacting server; Code: " + response.status;
				}
			);
	}
});