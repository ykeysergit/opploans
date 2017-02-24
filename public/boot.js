jQuery(function(){
	var circularTableApp = angular.module('circularTableApp', []);
	
	circularTableApp.controller('CircularTableController', function($scope) {
	  $scope.people = [];
	  $scope.seating_arrangements = [];
	});
});
