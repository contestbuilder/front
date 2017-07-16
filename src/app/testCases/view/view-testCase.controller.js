(function() {
'use strict';

angular
    .module('front')
    .controller('ViewTestCaseController', ViewTestCaseController);

/** @ngInject */
function ViewTestCaseController($routeParams, routeContest, routeProblem, routeTestCase) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.test_case = routeTestCase;

        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;
        vm.test_case_id = $routeParams.test_case_id;

        vm.test_case.current = vm.test_case.v[vm.test_case.v.length-1];
    };

    vm.init();
    return vm;
}
})();
