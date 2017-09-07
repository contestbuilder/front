(function() {
'use strict';

angular
    .module('front')
    .controller('RegularInvitationController', RegularInvitationController);

/** @ngInject */
function RegularInvitationController($location, $routeParams, $route, authService, routeUser, userService) {
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
        })
        .then(function(user) {
            return authService.login(form.username, form.password);
        })
        .then(function(data) {
            $route.reload();
            $location.path($filter('url', 'main'));
        })
        .catch(function(err) {
            console.log(err);
        });
    };

    vm.init();
    return vm;
}
})();
