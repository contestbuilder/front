(function() {
'use strict';

angular
    .module('front')
    .controller('ViewAllContestsController', ViewAllContestsController);

/** @ngInject */
function ViewAllContestsController(contestService, routeMe) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.contestList = [];

        contestService.getContests(vm.me.permissions && vm.me.permissions.delete_contest)
        .then(function(contests) {
            vm.contestList = contests;
        });
    };

    vm.init();
    return vm;
}
})();
