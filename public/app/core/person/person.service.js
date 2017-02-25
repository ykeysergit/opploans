angular.module('core.Person').
  factory('Person', ['$resource',
    function($resource) {
    
    	/*
    	 * Return a promise
    	 */
  		myns.Person.create=function(params){
  			var Client=$resource('/app/people');  			
  			var newClient = new Client();
  			
  			newClient.person={name: params.name, age: params.age};
  			newClient.$save().then(params.then);
  		};
  		
  		myns.Person.destroy=function(params){
  			var Client=$resource('/app/people/:id');  			
  			var newClient = new Client();
  			
  			newClient.$delete({id: params.id}).then(params.then);
  		};
  		
  		myns.Person.update=function(params){
  			var Client=$resource('/app/people/:id', null,
		    {
		        'update': { method:'PUT' }
		    });			
		    
  			var newClient = new Client();
  			
  			newClient.person={name: params.name, age: params.age};
  			newClient.$update({id: params.id}).then(params.then);
  		};

    	return myns.Person;
    }
  ]);