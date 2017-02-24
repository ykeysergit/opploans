angular.module('circularTableModule').
  component('circularTableComponent', {
    templateUrl:'circular-table/circular-table.template.html',
    controller: function CircularTableController() {
      this.seating_arrangements = [];
      this.people = [];
    }
  });

