mynamespace.Person=function(params){
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

mynamespace.Table=function(params){
	var id, seatArrangements=new Array();
	
	this.getSeatArrangements=function(){return seatArrangements;};
	this.removeSeatArrangementByPerson=function(person){};
	this.addSeatArrangement=function(seating){seatArrangements.push(seating);};
};

mynamespace.SeatArrangement=function(params){
	var table,person;
	
	(function init(){
		table=params.table;
		person=params.person;
	})();
	
	this.getTable=function(){return table;};
	this.getPerson=function(){return person;};
};
