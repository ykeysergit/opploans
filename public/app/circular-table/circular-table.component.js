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
      
      self.create=function(params){
      	Person.create(params);
      };
    }]
  });