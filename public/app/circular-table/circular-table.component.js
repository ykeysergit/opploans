angular.module('circularTableModule').
  component('circularTableComponent', {
    templateUrl:'circular-table/circular-table.template.html',
    controller: ['Person',function CircularTableController(Person) {
      this.seating_arrangements = [];
      this.people = [];
      
      this.create=function(params){
      	Person.create(params);
      };
    }]
  });