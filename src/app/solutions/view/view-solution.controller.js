(function() {
'use strict';

angular
    .module('front')
    .controller('ViewSolutionController', ViewSolutionController);

/** @ngInject */
function ViewSolutionController($routeParams, utilService, routeContest, routeProblem, routeSolution) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.solution = routeSolution;
        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;
        vm.solution_nickname = $routeParams.solution_nickname;

        vm.solution.current = vm.solution.v[vm.solution.v.length-1];
        vm.solution.current.language = utilService.getLanguage(vm.solution.current.language);
    };

    vm.init();
    return vm;
}
})();
