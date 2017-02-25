angular.module('core.Table').
  factory('Table', ['$resource',
    function($resource) {
    
    	/*
    	 * Return a promise
    	 */
  		myns.Table.create=function(params){
  			var Client=$resource('/app/tables');  			
  			var newClient = new Client();
  			
  			newClient.$save().then(params.then);
  		};
  		
  		myns.Table.destroy=function(params){
  			var Client=$resource('/app/tables/:id');  			
  			var newClient = new Client();
  			
  			newClient.$delete({id: params.id}).then(params.then);
  		};
  		
  		myns.Table.update=function(params){
  			var Client=$resource('/app/tables/:id', null,
		    {
		        'update': { method:'PUT' }
		    });			
		    
  			var newClient = new Client();
  			
  			newClient.table={};
  			newClient.$update({id: params.id}).then(params.then);
  		};

    	return myns.Table;
    }
  ]);