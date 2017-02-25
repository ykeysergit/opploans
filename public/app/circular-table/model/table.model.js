myns.Table=function(params){
	var self=this,id, seatArrangements=new Array();
	
	(function init(){
		id=params.id;
	})();
	
	this.getId=function(){return id;};
	this.setId=function(newId){id=newId;};
	this.getSeatArrangements=function(){return seatArrangements;};
	this.removeSeatArrangementByPerson=function(person){};
	this.addSeatArrangement=function(seating){seatArrangements.push(seating);};
	
	this.toString=function(){
		return JSON.stringify({id: id, seatingArrangements: seatArrangements});
	};
};
