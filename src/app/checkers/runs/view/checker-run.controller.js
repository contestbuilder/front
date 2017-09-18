(function() {
'use strict';

angular
    .module('front')
    .controller('ViewCheckerRunController', ViewCheckerRunController);

/** @ngInject */
function ViewCheckerRunController($routeParams, $filter, utilService, routeContest, routeProblem, routeChecker) {
    var vm = this;

    vm.init = function() {
        vm.contest   = routeContest;
        vm.problem   = routeProblem;
        vm.checker   = routeChecker;
        vm.runNumber = $routeParams.run_number;

        vm.checkersToShow = vm.problem.checkers.filter(function(checker) {
            return checker.nickname === vm.checker.nickname;
        });

        vm.urlFilter = $filter('url');
    };

    vm.init();
    return vm;
}
})();
