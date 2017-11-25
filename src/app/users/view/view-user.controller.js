(function() {
'use strict';

angular
    .module('front')
    .controller('ViewUserController', ViewUserController);

/** @ngInject */
function ViewUserController($routeParams, userService, routeMe, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.user = {};
        vm.loading = true;

        graphqlService.get({
            user: {
                name:       true,
                username:   true,
                deleted_at: true
            }
        }, {
            user_username: $routeParams.user_nickname
        }).then(function(data) {
            vm.user = data.user[0];

            vm.loading = false;
        })
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
