(function() {
'use strict';

angular
    .module('front')
    .controller('ViewTestCaseController', ViewTestCaseController);

/** @ngInject */
function ViewTestCaseController($routeParams, testCaseService, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.contest = {};
        vm.problem = {};
        vm.test_case = {};
        vm.loading = true;

        graphqlService.get({
            contest: {
                name:     true,
                nickname: true
            },

            problem: {
                name:     true,
                nickname: true
            },

            test_case: {
                id:     true,
                order:  true,
                input:  true,
                output: true
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname,
            test_case_id:     $routeParams.test_case_id
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];
            vm.test_case = data.test_case[0];

            vm.loading = false;
        });
    };

    // vm.loadMore = function(inputType) {
    //     var query = {};
    //     query['complete_' + inputType] = 'true';

    //     vm[inputType + 'Loading'] = true;
    //     testCaseService.getTestCase(
    //         vm.contest.nickname,
    //         vm.problem.nickname,
    //         vm.test_case.id,
    //         query
    //     )
    //     .then(function(test_case) {
    //         vm.test_case.current[inputType] = test_case.current[inputType];
    //         vm[inputType + 'Loaded'] = true;
    //         vm[inputType + 'Loading'] = false;
    //     })
    // };

    vm.init();
    return vm;
}
})();
