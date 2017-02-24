myns.Table=function(params){
	var id, seatArrangements=new Array();
	
	this.getSeatArrangements=function(){return seatArrangements;};
	this.removeSeatArrangementByPerson=function(person){};
	this.addSeatArrangement=function(seating){seatArrangements.push(seating);};
};
