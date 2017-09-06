(function() {
'use strict';

angular
    .module('front')
    .controller('RegularInvitationController', RegularInvitationController);

/** @ngInject */
function RegularInvitationController($location, $routeParams, routeUser, userService) {
    var vm = this;

    vm.init = function() {
        vm.user_id = $routeParams.user_id;
        vm.user = routeUser;

        fillDefaultValues();
    };

    function fillDefaultValues() {
        vm.form = {
            email:    routeUser.email,
            username: routeUser.username || '',
            password: ''
        };
    }

    vm.submit = function(form) {
        userService.editUser(vm.user_id, {
            username: form.username,
            password: form.password
        }).then(function(user) {
            console.log(user);
        });
    };

    vm.init();
    return vm;
}
})();
