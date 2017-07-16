(function() {
'use strict';

angular
    .module('front')
    .controller('ViewSolutionRunsController', ViewSolutionRunsController);

/** @ngInject */
function ViewSolutionRunsController($routeParams, $filter, utilService, routeContest, routeProblem, routeSolution) {
    var vm = this;

    vm.init = function() {
        vm.contest  = routeContest;
        vm.problem  = routeProblem;
        vm.solution = routeSolution;

        vm.runs = angular.copy(vm.solution.run);
    };

    vm.getRunLink = function(run_number) {
        return $filter('url')('contest.problem.solution.run.view', vm.contest.nickname, vm.problem.nickname, vm.solution.nickname, run_number);
    };

    vm.init();
    return vm;
}
})();
