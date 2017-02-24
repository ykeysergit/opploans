jQuery(function(){
	var circularTableApp = angular.module('circularTableApp', []);
	
	circularTableApp.controller('PeopleController', function PeopleController($scope) {
	  $scope.people = [];
	});
	
	circularTableApp.controller('SeatingArrangementsController', function SeatingArrangementsController($scope) {
	  $scope.seating_arrangements = [];
	});
});
