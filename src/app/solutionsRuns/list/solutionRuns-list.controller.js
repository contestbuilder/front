(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemSolutionRunsController', ViewProblemSolutionRunsController);

/** @ngInject */
function ViewProblemSolutionRunsController($routeParams, $filter, utilService, routeContest, routeProblem) {
    var vm = this;

    vm.init = function() {
        vm.contest  = routeContest;
        vm.problem  = routeProblem;

        vm.runs = angular.copy(vm.problem.solutions.reduce(function(prev, solution) {
            return prev.concat(solution.run);
        }, []));
    };

    vm.getRunLink = function(run_number) {
        return $filter('url')('contest.problem.solutionRun.view', vm.contest.nickname, vm.problem.nickname, run_number);
    };

    vm.init();
    return vm;
}
})();
