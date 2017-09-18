(function() {
'use strict';

angular
    .module('front')
    .controller('ViewCheckerRunsController', ViewCheckerRunsController);

/** @ngInject */
function ViewCheckerRunsController($routeParams, $filter, utilService, routeContest, routeProblem, routeChecker) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.checker = routeChecker;

        vm.runs = angular.copy(vm.checker.run);
    };

    vm.getRunLink = function(run_number) {
        return $filter('url')('contest.problem.checker.run.view', vm.contest.nickname, vm.problem.nickname, vm.checker.nickname, run_number);
    };

    vm.init();
    return vm;
}
})();
