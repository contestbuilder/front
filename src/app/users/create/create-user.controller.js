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
            email:    vm.form.email,
            password: vm.form.password
        }).then(function(user) {
            console.log(user);
        });
    };

    vm.init();
    return vm;
}
})();
