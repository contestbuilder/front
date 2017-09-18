(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemCheckerRunsController', ViewProblemCheckerRunsController);

/** @ngInject */
function ViewProblemCheckerRunsController($routeParams, $filter, utilService, routeContest, routeProblem) {
    var vm = this;

    vm.init = function() {
        vm.contest  = routeContest;
        vm.problem  = routeProblem;

        vm.runs = angular.copy(vm.problem.checkers.reduce(function(prev, checker) {
            return prev.concat(checker.run);
        }, []));
    };

    vm.getRunLink = function(run_number) {
        return $filter('url')('contest.problem.checkerRun.view', vm.contest.nickname, vm.problem.nickname, run_number);
    };

    vm.init();
    return vm;
}
})();
