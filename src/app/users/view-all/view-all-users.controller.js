(function() {
'use strict';

angular
    .module('front')
    .controller('ViewAllUsersController', ViewAllUsersController);

/** @ngInject */
function ViewAllUsersController(userService, routeMe, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.usersList = [];
        vm.loading = true;

        graphqlService.get({
            user: {
                name:       true,
                username:   true,
                deleted_at: true
            }
        }).then(function(data) {
            vm.usersList = data.user;

            vm.loading = false;
        });
    };

    vm.init();
    return vm;
}
})();
