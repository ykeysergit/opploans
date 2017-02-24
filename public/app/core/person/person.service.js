angular.module('core.Person').
  factory('Person', ['$resource',
    function($resource) {
    
  		myns.Person.create=function(params){
  			var Client=$resource('/app/people');  			
  			var newClient = new Client();
  			
  			newClient.person={name: params.age, age: params.age};
  			newClient.$save();
  		};

    	return myns.Person;
    }
  ]);