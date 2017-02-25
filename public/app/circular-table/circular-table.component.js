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
      self.autoRefreshEnabled=false;
      self.tableUpdated='';
      self.validation_messages=[];
      
      function clearInput(){
      	self.personId='';
      	self.tableId='';
		self.name='';
		self.age='';
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
  			self.seating_arrangements.length=0;
  			
  			jQuery.each(tablesJson, function(index, tableJson){
				var newTable = new myns.Table({id: tableJson.id});
				self.tables.push(newTable);
				self.tablesLookup[tableJson.id]=newTable;
				
				jQuery.each(tableJson.seating_arrangements, function(seat_iter, seat){
					var newSeatingArrangement = new myns.SeatArrangement({
						table: newTable, 
						person: self.peopleLookup[seat.person.id],
						position: seat.position
						});
					
					self.seating_arrangements.push(newSeatingArrangement);
					self.seating_arrangements_lookup[newSeatingArrangement.getId()]=newSeatingArrangement;
				});
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
  			self.validation_messages=[];
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
  			
  			self.seating_arrangements.length=0;
  			
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
  			
  			self.tableUpdated=tableJson.id;
  			
  			jQuery.each(tableJson.errors, function(index, error_msg){
  				self.validation_messages.push(error_msg);
  			});
  			
  			if(!tableJson.errors || tableJson.errors.length==0){
  				self.validation_messages=[];
  			}
  		};
  	
  		Table.update({id: params.id, people: self.people, then: params.then});
      };
      
      self.destroyTable=function(params){
  		console.log("[CircularTableComponent][destroyTable] Destroying...");
      	
  		if(!jQuery.isPlainObject(params)){
  			params={};
  		}
  	
  		params.then=function(tableJson){			
  			console.log("[CircularTableComponent][destroyTable] Table json received: "+JSON.stringify(tableJson));
  			console.log("[CircularTableComponent][destroyTable] Num tables before destroy: "+self.tables.length);
  			
  			// remove table
  			jQuery.each(self.tables,function(index,table){
  				if(tableJson.id == table.getId()){
	  				console.log("[CircularTableComponent][destroyTable] Table to remove: "+table);
	  				self.tables.splice(index,1);
	  				console.log("[CircularTableComponent][destroyTable] Removed table: "+table); 
	  				console.log("[CircularTableComponent][destroyTable] Num tables after destroy: "+self.tables.length);
  					return false;
  				}
  			});
		
			if(self.tableUpdated == tableJson.id){
				self.seating_arrangements.length=0;
				self.tableUpdated='';
			}
	
  			clearInput();
  			self.validation_messages=[];
  		};
  		
  		Table.destroy({id: params.id, then: params.then});
      };
      
      self.updatePerson=function(params){
      	if(!jQuery.isPlainObject(params)){
      			params={};
      		}
      	
      	params.then=function(personJson){		
  			jQuery.each(self.people,function(index, person){
  				if(person.getId() == personJson.id){
  					console.log("[CircularTableComponent][updatePerson] Person before update: "+person);
	      			
	      			person.setName(personJson.name);
	      			person.setAge(personJson.age);
	      			
	      			console.log("[CircularTableComponent][updatePerson] Updated person json: " + JSON.stringify(personJson));
	      			console.log("[CircularTableComponent][updatePerson] Person after update: " + person);
	      			clearInput();
  					return false;
  				}
  			});
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
      	
      	params.then=function(personJson){
      		if(!jQuery.isEmptyObject(personJson)){
      			console.log("[CircularTableComponent][destroyPerson] Number of known people before destroy: "+self.people.length);
      			console.log("[CircularTableComponent][destroyPerson] Deleted person json: " + JSON.stringify(personJson));
      			
	      		var personObj = new myns.Person({id: personJson.id, name: personJson.name, age: personJson.age});
	      		
	      		console.log("[CircularTableComponent][destroyPerson] Deleted person object: " + personObj);
	  			
	  			jQuery.each(self.people,function(index, person){
	  				if(person.getId()==personObj.getId()){
	  					console.log("[CircularTableComponent][destroyPerson] Found person to remove: "+person);
	  					self.people.splice(index,1);
	  					return false;
	  				}
	  			});
	  			
	  			clearInput();
	  			
	  			console.log("[CircularTableComponent][destroyPerson] Number of known people after destroy: "+self.people.length);
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
      	};
      	
      	params.error=function(httpResp){
      		console.log("[CircularTableComponent][createPerson] resp: "+JSON.stringify(httpResp));
      	};
      	
      	console.log("[CircularTableComponent][createPerson] create person: " +JSON.stringify({age: params.age, name: params.name}));
      	
      	return Person.create({age: params.age, name: params.name, then: params.then, error: params.error});
      };
    }]
  });