(function() {
'use strict';

angular
    .module('front')
    .controller('ViewUserController', ViewUserController);

/** @ngInject */
function ViewUserController(userService, routeMe, routeUser) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.user = routeUser;
    };

    vm.deleteUser = function() {
        return function() {
            userService.deleteUser(vm.user.username)
            .then(function(user) {
                vm.user = user;
            });
        };
    };

    vm.init();
    return vm;
}
})();
