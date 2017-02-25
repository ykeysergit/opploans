angular.module('core.Table').
  factory('Table', ['$resource',
    function($resource) {
    
    	/*
    	 * Return a promise
    	 */
    	myns.Table.index=function(params){
    		if(!params.then){
  				throw '[TableService][index] then param is required: '+params.then;
  			}
  			
  			 var Client=$resource('/app/tables', {}, {
		        query: {
		          method: 'GET',
		          isArray: true
		        }
		      });

  			console.log("[TableService][index] getting...");
  			Client.query({},params.then);
    	};
    	
  		myns.Table.create=function(params){
  			if(!jQuery.isPlainObject(params)){
  				throw '[TableService][create] params is not a plain object: '+JSON.stringify(params);
  			}
  			else if(!params.then){
  				throw '[TableService][create] then param is required: '+JSON.stringify();
  			}
  			
  			console.log("[TableService][update] creating with params: "+JSON.stringify(params));
  			
  			var Client=$resource('/app/tables');  			
  			var newClient = new Client();
  			
  			newClient.$save({},params.success,params.error).then(params.then);
  		};
  		
  		myns.Table.destroy=function(params){
  			if(!jQuery.isPlainObject(params)){
  				throw '[TableService][destroy] params is not a plain object: '+JSON.stringify(params);
  			}
  			else if(!params.then){
  				throw '[TableService][destroy] then param is required: '+JSON.stringify();
  			}
  			
  			console.log("[TableService][update] destroying with params: "+JSON.stringify(params));
  			
  			var Client=$resource('/app/tables/:id');  			
  			var newClient = new Client();
  			
  			newClient.$delete({id: params.id},params.success,params.error).then(params.then);
  		};
  		
  		myns.Table.update=function(params){
  			if(!jQuery.isPlainObject(params)){
  				throw '[TableService][update] params is not a plain object: '+JSON.stringify(params);
  			}
  			else if(!params.then){
  				throw '[TableService][update] then param is required: '+JSON.stringify();
  			}
  			
  			console.log("[TableService][update] Updating with params: "+JSON.stringify(params));
  			
  			var Client=$resource('/app/tables/:id', null,
		    {
		        'update': { method:'PUT' }
		    });			
		    
  			var newClient = new Client();
  			
  			newClient.table={people: params.people};
  			newClient.$update({id: params.id},params.success,params.error).then(params.then);
  		};

    	return myns.Table;
    }
  ]);