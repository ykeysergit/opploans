angular.module('circularTableModule').
  component('circularTableComponent', {
    templateUrl:'circular-table/circular-table.template.html',
    controller: ['Person',function CircularTableController(Person) {
      var self=this;
      self.seating_arrangements = [];
      self.people = [];
      self.age='';
      self.name='';
      self.id='';
      self.error='';
      
      function clearInput(){
      	self.id='';
		self.name='';
		self.age='';
      }
      
      self.update=function(params){
      	params.then=function(newPersonJson){
      		var foundIndex=-1;
      		
      		if(jQuery.isEmptyObject(newPersonJson)){
      			console.log("[CircularTableComponent][update] Did not update person("+newPersonObj.getId()+")");
      			return;
      		}
      			  		
  			jQuery.each(self.people,function(index, element){
  				if(element.getId()==newPersonJson.id){
  					foundIndex=index;
  					return false;
  				}
  			});
  			
  			if(foundIndex>=0){
  				console.log("[CircularTableComponent][update] Person before update: "+self.people[foundIndex]);

      			var targetPerson = self.people[foundIndex];
      			
      			targetPerson.setName(newPersonJson.name);
      			targetPerson.setAge(newPersonJson.age);
      			
      			console.log("[CircularTableComponent][update] Updated person json: " + JSON.stringify(newPersonJson));
      			console.log("[CircularTableComponent][update] Person after update: " + targetPerson);
      			clearInput();
  			}else{
  				console.log("[CircularTableComponent][destroy] Did not update person("+newPersonObj.getId()+")");
  			}
      	};
  		
      	
      	return Person.update(params);
      };
      
      self.destroy=function(params){
      	params.then=function(newPersonJson){
      		if(!jQuery.isEmptyObject(newPersonJson)){
      			console.log("[CircularTableComponent][destroy] Number of known people before destroy: "+self.people.length);
      			console.log("[CircularTableComponent][destroy] Deleted person json: " + JSON.stringify(newPersonJson));
      			
	      		var newPersonObj = new myns.Person({id: newPersonJson.id, name: newPersonJson.name, age: newPersonJson.age});
	      		
	      		console.log("[CircularTableComponent][destroy] Deleted person object: " + newPersonObj);
	  			
	  			var foundIndex=-1;
	  			
	  			jQuery.each(self.people,function(index, element){
	  				if(element.getId()==newPersonObj.getId()){
	  					foundIndex=index;
	  					return false;
	  				}
	  			});
	  			
	  			// remove element
	  			if(foundIndex>=0){
	  				console.log("[CircularTableComponent][destroy] Found person to remove: "+self.people[foundIndex]);
	  				self.people.splice(foundIndex,1);
	  			}else{
	  				console.log("[CircularTableComponent][destroy] Did not find person("+newPersonObj.getId()+")");
	  			}
	  			
	  			clearInput();
	  			
	  			console.log("[CircularTableComponent][destroy] Number of known people after destroy: "+self.people.length);
  			}
  			else{
  				self.error="Person not deleted: "+params.id;
  			}
      	};
      	
      	return Person.destroy(params);
      };
      
      self.create=function(params){
      	params.then=function(newPersonJson){
      		if(!jQuery.isEmptyObject(newPersonJson)){
	      		console.log("[CircularTableComponent][create] Number of known people before create: "+self.people.length);
	      		console.log("[CircularTableComponent][create] New person json: " + JSON.stringify(newPersonJson));
	      		
	      		var newPersonObj = new myns.Person({id: newPersonJson.id, name: newPersonJson.name, age: newPersonJson.age});
	      		self.people.push(newPersonObj);
	      		
	      		console.log("[CircularTableComponent][create] New person object: " + newPersonObj);
	      		console.log("[CircularTableComponent][create] Number of known people after create: "+self.people.length);
	      		
	      		clearInput();
      		}
      		else{
      			self.error="Person not created: "+params.name+"("+params.age+")";
      		}
      	};
      	
      	return Person.create(params);
      };
    }]
  });