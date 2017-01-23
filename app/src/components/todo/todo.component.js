(function(){
  
       angular.module('todo-app').component('todoList', {
         template: '<h1>todo list</h1>',
         controller: function() {
            console.log('todo list contoller');
         }
       });

}());
