myns.Person=function(params){
	var self=this, id, age, name, tables=new Array(),seatArrangements=new Array();
	
	(function init()
	{
		if(jQuery.isPlainObject(params)){ 
			id=params.id;
			age=params.age;
			name=params.name;
		}
	})();
	
	self.getId=function(){return id;};
	self.getAge=function(){return age;};
	self.getName=function(){return name;};
	
	self.setId=function(newId){id=newId;};
	self.setAge=function(newAge){age=newAge;};
	self.setName=function(newName){name=newName;};	
	
	self.toString=function(){
		return JSON.stringify(self.toPlainObject());
	};
	
	self.toPlainObject=function(){
		return {id: id, name: name, age: age};
	};
};
