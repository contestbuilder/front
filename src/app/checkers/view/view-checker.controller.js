(function() {
'use strict';

angular
    .module('front')
    .controller('ViewCheckerController', ViewCheckerController);

/** @ngInject */
function ViewCheckerController($routeParams, utilService, routeContest, routeProblem, routeChecker) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.checker = routeChecker;
        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;
        vm.checker_nickname = $routeParams.checker_nickname;

        vm.checker.current = vm.checker.v[vm.checker.v.length-1];
        vm.checker.current.language = utilService.getLanguage(vm.checker.current.language);
    };

    vm.init();
    return vm;
}
})();
