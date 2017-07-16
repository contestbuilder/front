(function() {
'use strict';

angular
    .module('front')
    .controller('ViewSolutionRunController', ViewSolutionRunController);

/** @ngInject */
function ViewSolutionRunController($routeParams, $filter, utilService, routeContest, routeProblem, routeSolution) {
    var vm = this;

    vm.init = function() {
        vm.contest   = routeContest;
        vm.problem   = routeProblem;
        vm.solution  = routeSolution;
        vm.runNumber = $routeParams.run_number;

        vm.solutionsToShow = vm.problem.solutions.filter(function(solution) {
            return solution.nickname === vm.solution.nickname;
        });

        vm.urlFilter = $filter('url');
    };

    vm.init();
    return vm;
}
})();
