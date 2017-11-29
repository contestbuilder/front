(function() {
'use strict';

angular
    .module('front')
    .controller('RegularInvitationController', RegularInvitationController);

/** @ngInject */
function RegularInvitationController($location, $routeParams, $filter, $route, authService, userService, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.user = {};
        vm.loading = true;

        graphqlService.get({
            user: {
                id:       true,
                name:     true,
                email:    true,
                username: true
            }
        }, {
            user_id: +$routeParams.user_id
        }).then(function(data) {
            vm.user = data.user[0];

            fillDefaultValues(vm.user);

            vm.loading = false;
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
        userService.editUser(vm.user.id, {
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
