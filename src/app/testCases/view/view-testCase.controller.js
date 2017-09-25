(function() {
'use strict';

angular
    .module('front')
    .controller('ViewTestCaseController', ViewTestCaseController);

/** @ngInject */
function ViewTestCaseController($routeParams, testCaseService, routeContest, routeProblem, routeTestCase) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.test_case = routeTestCase;

        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;
        vm.test_case_id = $routeParams.test_case_id;
    };

    vm.loadMore = function(inputType) {
        var query = {};
        query['complete_' + inputType] = 'true';

        vm[inputType + 'Loading'] = true;
        testCaseService.getTestCase(
            vm.contest_nickname,
            vm.problem_nickname,
            vm.test_case_id,
            query
        )
        .then(function(test_case) {
            vm.test_case.current[inputType] = test_case.current[inputType];
            vm[inputType + 'Loaded'] = true;
            vm[inputType + 'Loading'] = false;
        })
    };

    vm.init();
    return vm;
}
})();
