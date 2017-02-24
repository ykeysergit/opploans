myns.SeatArrangement=function(params){
	var table,person;
	
	(function init(){
		table=params.table;
		person=params.person;
	})();
	
	this.getTable=function(){return table;};
	this.getPerson=function(){return person;};
};

