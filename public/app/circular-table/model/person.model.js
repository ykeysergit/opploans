jQuery(function(){
	myns.Person=function(params){
		var id, age, name, tables=new Array(),seatArrangements=new Array();
		
		(function init()
		{
			age=params.age;
			name=params.name;
		})();
		
		this.getId=function(){return id;};
		this.getAge=function(){return age;};
		this.getName=function(){return name;};
		
		this.setAge=function(newAge){age=newAge;};
		this.setName=function(newName){name=newName;};	
	};
});
