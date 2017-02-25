myns.SeatArrangement=function(params){
	var self=this,table,person,id,position;
	
	(function init(){
		table=params.table;
		person=params.person;
		id=params.id;
		position=params.position;
	})();
	
	this.setPosition=function(newPos){position=newPos;};
	this.getPosition=function(){return position;};
	this.setId=function(newId){id=newId;};
	this.setTable=function(newTable){table=newTable;};
	this.setPerson=function(newPerson){person=newPerson;};
	this.getTable=function(){return table;};
	this.getPerson=function(){return person;};
	
	this.toString=function(){
		return JSON.stringify({id: id, table_id: table.getId(), person_id: person.getId(), position: position});
	};
};

