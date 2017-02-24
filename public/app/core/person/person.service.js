angular.module('core.Person').
  factory('Person', ['$resource',
    function($resource) {
    
  		myns.Person.create=function(params){
  			$resource('/people',
  				{person:{name: '@name', age: '@age'}}
  			).$save(params);
  		};

    	return myns.Person;
    }
  ]);