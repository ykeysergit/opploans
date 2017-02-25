angular.module('circularTableModule').
  component('circularTableComponent', {
    templateUrl:'circular-table/circular-table.template.html',
    controller: ['Person','Table',function CircularTableController(Person, Table) {
      var self=this;
      self.seating_arrangements = [];
      self.tables = [];
      self.people = [];
      self.age='';
      self.name='';
      self.personId='';
      self.tableId='';
      self.personError='';
      self.tableError='';
      
      function clearInput(){
      	self.personId='';
      	self.tableId='';
		self.name='';
		self.age='';
		self.personError='';
		self.tableError='';
      }
      
      self.createTable=function(params){
      	console.log("[CircularTableComponent][createTable] creating...");
      	
  		if(!jQuery.isPlainObject(params)){
  			params={};
  		}
  	
  		params.then=function(tableJson){
  			console.log("[CircularTableComponent][createTable] New table json: "+JSON.stringify(tableJson));
  			console.log("[CircularTableComponent][createTable] Num tables before create: "+self.tables.length);
  			
  			var newTable = new myns.Table({id: tableJson.id});
  			
  			self.tables.push(newTable);
  			console.log("[CircularTableComponent][createTable] New table created: " + newTable);
  			console.log("[CircularTableComponent][createTable] Num tables after create: "+self.tables.length);
  			clearInput();
  		};
  	
  		Table.create(params);
      };
      
      self.updateTable=function(params){
      		if(!jQuery.isPlainObject(params)){
      			params={};
      		}
      	
      		params.then=function(tableJson){
      			// TODO
      			clearInput();
      		};
      	
      		Table.update(params);
      };
      
      self.destroyTable=function(params){
  		console.log("[CircularTableComponent][destroyTable] Destroying...");
      	
  		if(!jQuery.isPlainObject(params)){
  			params={};
  		}
  	
  		params.then=function(tableJson){
  			var foundIndex=-1;
  			
  			console.log("[CircularTableComponent][destroyTable] Table json received: "+JSON.stringify(tableJson));
  			console.log("[CircularTableComponent][destroyTable] Num tables before destroy: "+self.tables.length);
  			
  			jQuery.each(self.tables,function(index,element){
  				if(tableJson.id == element.getId()){
  					foundIndex=index;
  					return false;
  				}
  			});
  			
  			if(foundIndex >= 0){
  				var targetTable=self.tables[foundIndex];
  				console.log("[CircularTableComponent][destroyTable] Table to remove: "+targetTable);
  				self.tables.splice(foundIndex,1);
  				console.log("[CircularTableComponent][destroyTable] Removed table: "+tableJson.id); 
  				console.log("[CircularTableComponent][destroyTable] Num tables after destroy: "+self.tables.length);
  				clearInput();
  			}
  			else
  			{
  				console.log("[CircularTableComponent][destroyTable] Table not removed: "+tableJson.id); 
  			}
  		};
  		
  		Table.destroy(params);
      };
      
      self.updatePerson=function(params){
      	if(!jQuery.isPlainObject(params)){
      			params={};
      		}
      	
      	params.then=function(newPersonJson){
      		var foundIndex=-1;
      		
      		if(jQuery.isEmptyObject(newPersonJson)){
      			console.log("[CircularTableComponent][updatePerson] Did not update person("+newPersonObj.getId()+")");
      			return;
      		}
      			  		
  			jQuery.each(self.people,function(index, element){
  				if(element.getId() == newPersonJson.id){
  					foundIndex=index;
  					return false;
  				}
  			});
  			
  			if(foundIndex>=0){
  				console.log("[CircularTableComponent][updatePerson] Person before update: "+self.people[foundIndex]);

      			var targetPerson = self.people[foundIndex];
      			
      			targetPerson.setName(newPersonJson.name);
      			targetPerson.setAge(newPersonJson.age);
      			
      			console.log("[CircularTableComponent][updatePerson] Updated person json: " + JSON.stringify(newPersonJson));
      			console.log("[CircularTableComponent][updatePerson] Person after update: " + targetPerson);
      			clearInput();
  			}else{
  				console.log("[CircularTableComponent][updatePerson] Did not update person("+newPersonObj.getId()+")");
  			}
      	};
  		
  		params.error=function(httpResp){
      		console.log("[CircularTableComponent][updatePerson] resp: "+JSON.stringify(httpResp));
      	};
      	
      	return Person.update({id: params.id, name: params.name, age: params.age, then: params.then, error: params.error});
      };
      
      self.destroyPerson=function(params){
      	if(!jQuery.isPlainObject(params)){
      			params={};
      		}
      	
      	params.then=function(newPersonJson){
      		if(!jQuery.isEmptyObject(newPersonJson)){
      			console.log("[CircularTableComponent][destroyPerson] Number of known people before destroy: "+self.people.length);
      			console.log("[CircularTableComponent][destroyPerson] Deleted person json: " + JSON.stringify(newPersonJson));
      			
	      		var newPersonObj = new myns.Person({id: newPersonJson.id, name: newPersonJson.name, age: newPersonJson.age});
	      		
	      		console.log("[CircularTableComponent][destroyPerson] Deleted person object: " + newPersonObj);
	  			
	  			var foundIndex=-1;
	  			
	  			jQuery.each(self.people,function(index, element){
	  				if(element.getId()==newPersonObj.getId()){
	  					foundIndex=index;
	  					return false;
	  				}
	  			});
	  			
	  			// remove element
	  			if(foundIndex>=0){
	  				console.log("[CircularTableComponent][destroyPerson] Found person to remove: "+self.people[foundIndex]);
	  				self.people.splice(foundIndex,1);
	  			}else{
	  				console.log("[CircularTableComponent][destroyPerson] Did not find person("+newPersonObj.getId()+")");
	  			}
	  			
	  			clearInput();
	  			
	  			console.log("[CircularTableComponent][destroyPerson] Number of known people after destroy: "+self.people.length);
  			}
  			else{
  				self.error="Person not deleted: "+params.id;
  			}
      	};
      	
      	params.error=function(httpResp){
      		console.log("[CircularTableComponent][destroyPerson] resp: "+JSON.stringify(httpResp));
      	};
      	
      	return Person.destroy({id: params.id, then: params.then, error: params.error});
      };
      
      self.createPerson=function(params){
      	if(!jQuery.isPlainObject(params)){
      			params={};
      		}
      	
      	params.then=function(personJson){
      		console.log("[CircularTableComponent][createPerson] Received payload: "+personJson);
      		
      		if(!jQuery.isEmptyObject(personJson)){
	      		console.log("[CircularTableComponent][createPerson] Number of known people before create: "+self.people.length);
	      		console.log("[CircularTableComponent][createPerson] New person json: " + JSON.stringify(personJson));
	      		
	      		var newPersonObj = new myns.Person({id: personJson.id, name: personJson.name, age: personJson.age});
	      		self.people.push(newPersonObj);
	      		
	      		console.log("[CircularTableComponent][createPerson] New person object: " + personJson);
	      		console.log("[CircularTableComponent][createPerson] Number of known people after create: "+self.people.length);
	      		
	      		clearInput();
      		}
      		else{
      			self.error="Person not created: "+params.name+"("+params.age+")";
      		}
      	};
      	
      	params.error=function(httpResp){
      		console.log("[CircularTableComponent][createPerson] resp: "+JSON.stringify(httpResp));
      	};
      	
      	console.log("[CircularTableComponent][createPerson] create person: " +JSON.stringify({age: params.age, name: params.name}));
      	
      	return Person.create({age: params.age, name: params.name, then: params.then, error: params.error});
      };
    }]
  });