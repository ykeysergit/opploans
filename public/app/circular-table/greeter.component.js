angular.
  module('circularTableApp').
  component('greetUserComponent', {
    templateUrl: 'circular-table/greeter.template.html',
    controller: function GreetUserController() {
      this.message = 'Opploans';
    }
  });