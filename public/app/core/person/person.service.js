angular.module('core.Person').
  factory('Person', ['$resource',
    function($resource) {
    
    	/*
    	 * Return a promise
    	 */
    	
    	myns.Person.index=function(params){
    		if(!params.then){
  				throw '[PersonService][index] then param is required: '+params.then;
  			}
  			
  			 var Client=$resource('/app/people', {}, {
		        query: {
		          method: 'GET',
		          isArray: true
		        }
		      });

  			console.log("[PersonService][index] getting...");
  			Client.query({},params.then);
    	};
    	
  		myns.Person.create=function(params){
  			if(!jQuery.isPlainObject(params)){
  				throw '[PersonService][create] params is not a plain object: '+JSON.stringify(params);
  			}
  			else if(!params.then){
  				throw '[PersonService][create] then param is required: '+JSON.stringify();
  			}
  			
  			var Client=$resource('/app/people');  			
  			var newClient = new Client();
  			
  			newClient.person={name: params.name, age: params.age};
  			
  			console.log("[PersonService][create] saving using params "+JSON.stringify(params));
  			newClient.$save({},params.success,params.error).then(params.then,params.error);
  		};
  		
  		myns.Person.destroy=function(params){
  			if(!jQuery.isPlainObject(params)){
  				throw '[PersonService][destroy] params is not a plain object: '+JSON.stringify(params);
  			}
  			else if(!params.then){
  				throw '[PersonService][destroy] then param is required: '+JSON.stringify();
  			}
  			
  			var Client=$resource('/app/people/:id');  			
  			var newClient = new Client();
  			
  			console.log("[PersonService][create] deleting using params "+JSON.stringify(params));
  			newClient.$delete({id: params.id},params.success,params.error).then(params.then,params.error);
  		};
  		
  		myns.Person.update=function(params){
  			if(!jQuery.isPlainObject(params)){
  				throw '[PersonService][update] params is not a plain object: '+JSON.stringify(params);
  			}
  			else if(!params.then){
  				throw '[PersonService][update] then param is required: '+JSON.stringify();
  			}
  			
  			var Client=$resource('/app/people/:id', null,
		    {
		        'update': { method:'PUT' }
		    });			
		    
  			var newClient = new Client();
  			
  			newClient.person={name: params.name, age: params.age};
  			
  			console.log("[PersonService][create] updating using params "+JSON.stringify(params));
  			newClient.$update({id: params.id},params.success,params.error).then(params.then,params.error);
  		};

    	return myns.Person;
    }
  ]);