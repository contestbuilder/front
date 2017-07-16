(function() {
'use strict';

angular
    .module('front')
    .controller('CreateContestController', CreateContestController);

/** @ngInject */
function CreateContestController($location, contestService, routeMe) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
    };

    vm.submit = function() {
        contestService.createContest({
            name: vm.form.name
        }).then(function(contest) {
            $location.path('/contests');
        });
    };

    vm.init();
    return vm;
}
})();
