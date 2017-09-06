(function() {
'use strict';

angular
    .module('front')
    .controller('CreateUserController', CreateUserController);

/** @ngInject */
function CreateUserController(userService) {
    var vm = this;

    vm.init = function() {
    };

    vm.submit = function() {
        userService.createUser({
            username: vm.form.username,
            email:    vm.form.email
        }).then(function(user) {
            console.log(user);
        });
    };

    vm.init();
    return vm;
}
})();
