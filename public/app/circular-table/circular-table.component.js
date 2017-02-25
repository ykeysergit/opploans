angular.module('circularTableModule').
  component('circularTableComponent', {
    templateUrl:'circular-table/circular-table.template.html',
    controller: ['Person','Table',function CircularTableController(Person, Table) {
      var self=this;
      var autoReloadInterval;
      var autoReloadRate=1000;
      
      self.seating_arrangements = [];
      self.tables = [];
      self.people = [];
      self.peopleLookup={};
      self.tablesLookup={};
      self.seating_arrangements_lookup={};
      self.age='';
      self.name='';
      self.personId='';
      self.tableId='';
      self.personError='';
      self.tableError='';
      self.autoRefreshEnabled=false;
      
      function clearInput(){
      	self.personId='';
      	self.tableId='';
		self.name='';
		self.age='';
		self.personError='';
		self.tableError='';
      }
      
      self.toggleAutoReload=function(){
      	console.log("[CircularTableComponent][toggleAutoReload] autoRefreshEnabled? "+self.autoRefreshEnabled);
      	
      	if(!self.autoRefreshEnabled){
      		self.startAutoReload();
      	}else{
      		self.stopAutoReload();
      	}
      };
      
      self.startAutoReload=function(){
      	if(!self.autoRefreshEnabled){
      		autoReloadInterval=setInterval(function(){ self.reload(); }, autoReloadRate);
      		self.autoRefreshEnabled=true;
      		console.log("[CircularTableComponent][runAutoReload] started.");
      	}
      };
      
      self.stopAutoReload=function(){
      	if(self.autoRefreshEnabled){
      		clearInterval(autoReloadInterval);
      		self.autoRefreshEnabled=false;
      		console.log("[CircularTableComponent][stopAutoReload] stopped.");
      	}
      };
      
      self.reload=function(){
      	console.log("[CircularTableComponent][reload] reloading...");
	
		var params={};

		params.then=function(peopleJson){
  			console.log("[CircularTableComponent][reload] reloading people...");
  			console.log("[CircularTableComponent][reload] received people json: "+JSON.stringify(peopleJson));
  			
  			self.people.length=0;
  			
  			jQuery.each(peopleJson,function(index, personJson){
				var newPerson = new myns.Person({id: personJson.id, name: personJson.name, age: personJson.age});
				self.people.push(newPerson);
				self.peopleLookup[personJson.id]=newPerson;
  			});
  		};

  		console.log("[CircularTableComponent][reload] calling people#index with then handler: "+params.then);
  		
  		Person.index({then: params.then});
  		
  		
  		params.then=function(tablesJson){
  			console.log("[CircularTableComponent][reload] reloading tables...");
  			console.log("[CircularTableComponent][reload] received tables json: "+JSON.stringify(tablesJson));
  			
  			self.tables.length=0;
  			
  			jQuery.each(tablesJson, function(index, tableJson){
				var newTable = new myns.Table({id: tableJson.id});
				self.tables.push(newTable);
				self.tablesLookup[tableJson.id]=newTable;
  				
  			});
  		};
  		
  		Table.index({then: params.then});
      };
      
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
  			self.tablesLookup[newTable.getId()]=newTable;
  			console.log("[CircularTableComponent][createTable] New table created: " + newTable);
  			console.log("[CircularTableComponent][createTable] Num tables after create: "+self.tables.length);
  			clearInput();
  		};
  	
  		Table.create({then: params.then});
      };
      
      self.updateTable=function(params){
      	console.log("[CircularTableComponent][updateTable] Updating...");
      	
  		if(!jQuery.isPlainObject(params)){
  			params={};
  		}
  	
  		params.then=function(tableJson){
  			console.log("[CircularTableComponent][updateTable] Received json: " + JSON.stringify(tableJson));
  			
  			if(jQuery.type(tableJson.seating_arrangements)!="array" || tableJson.seating_arrangements.length==0){
  				console.log("[CircularTableComponent][updateTable] No seating arrangements received: "+JSON.stringify(tableJson));
  				clearInput();
  				return;
  			}
  			
  			
  			jQuery.each(tableJson.seating_arrangements, function(index, seating){
  				var newSeating = new myns.SeatArrangement({	
  							id: seating.id, 
  							table: self.tablesLookup[seating.table_id], 
  							person: self.peopleLookup[seating.person.id],
  							position: seating.position
  						});
  					
				self.seating_arrangements.push(newSeating);
				self.seating_arrangements_lookup[newSeating.getId()]=newSeating;
				console.log("[CircularTableComponent][updateTable] New seating: "+newSeating);
				clearInput();
  			});
  			
  		};
  	
  		Table.update({id: params.id, people: self.people, then: params.then});
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
  		
  		Table.destroy({id: params.id, then: params.then});
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
	  			
	  			jQuery.each(self.people,function(index, person){
	  				if(person.getId()==newPersonObj.getId()){
	  					console.log("[CircularTableComponent][destroyPerson] Found person to remove: "+person);
	  					self.people.splice(index,1);
	  					return false;
	  				}
	  			});
	  			
	  			
	  			// remove associated seat arrangements
	  			jQuery.each(self.seat_arrangements,function(index, seating){
	  				if(seating.getPerson().getId()==newPersonObj.getId()){
	  					self.seating_arrangements.splice(index,1);
	  					self.seating_arrangements_lookup[seating.getId()]=null;
	  					console.log("[CircularTableComponent][destroyPerson] Removed seat arrangement: "+seating.getId());
	  				}
	  			});
			
	  			
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
	      		self.peopleLookup[newPersonObj.getId()]=newPersonObj;
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