myns.Table=function(params){
	var self=this,id, seat_arrangements=[], people=[];
	
	(function init(){
		id=params.id;
		seat_arrangements=params.seat_arrangements;
		people=params.people;
		
	})();
	
	this.getId=function(){return id;};
	this.setId=function(newId){id=newId;};
	
	this.getPeople=function(){return people;};
	this.addPerson=function(person){people.push(person);};
	this.clearPeople=function(){people.length=0;};
	
	this.getSeatArrangements=function(){return seat_arrangements;};
	this.addSeatArrangement=function(seating){seat_arrangements.push(seating);};
	this.clearSeatArrangements=function(){seat_arrangements.length=0;};
	
	this.toString=function(){
		return JSON.stringify({id: id, seating_arrangements: seat_arrangements});
	};
};
