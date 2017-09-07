(function() {
'use strict';

angular
    .module('front')
    .controller('CreateUserController', CreateUserController);

/** @ngInject */
function CreateUserController($location, $filter, userService) {
    var vm = this;

    vm.init = function() {
    };

    vm.submit = function() {
        userService.createUser({
            username:            vm.form.username,
            email:               vm.form.email,
            sendEmailInvitation: true
        }).then(function(user) {
            $location.path($filter('url')('user.view', user.username));
        });
    };

    vm.init();
    return vm;
}
})();
