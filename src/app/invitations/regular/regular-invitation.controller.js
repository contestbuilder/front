(function() {
'use strict';

angular
    .module('front')
    .controller('RegularInvitationController', RegularInvitationController);

/** @ngInject */
function RegularInvitationController($location, $routeParams, $filter, $route, authService, invitationService) {
    var vm = this;

    vm.init = function() {
        vm.user = {};
        vm.loading = true;

        invitationService.getUser($routeParams.user_id)
        .then(function(user) {
            vm.user = user;

            fillDefaultValues(vm.user);

            vm.loading = false;
        })
        .catch(function(error) {
            $location.path($filter('url', 'main'));
        });
    };

    function fillDefaultValues(user) {
        vm.form = {
            email:    user.email,
            username: user.username || '',
            password: ''
        };
    }

    vm.submit = function(form) {
        invitationService.editUser(vm.user.id, {
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
