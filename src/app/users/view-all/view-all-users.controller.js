(function() {
'use strict';

angular
    .module('front')
    .controller('ViewAllUsersController', ViewAllUsersController);

/** @ngInject */
function ViewAllUsersController(userService, routeMe) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.usersList = [];

        userService.getUsers(vm.me.permissions && vm.me.permissions.delete_user)
        .then(function(users) {
            vm.usersList = users;
        });
    };

    vm.init();
    return vm;
}
})();
