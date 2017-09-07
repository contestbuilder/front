(function() {
'use strict';

angular
    .module('front')
    .controller('EditTestCaseController', EditTestCaseController);

/** @ngInject */
function EditTestCaseController($location, $filter, routeContest, routeProblem, routeTestCase, testCaseService) {
    var vm = this;

    vm.init = function() {
        vm.contest  = routeContest;
        vm.problem  = routeProblem;
        vm.testCase = routeTestCase;
        vm.testCase.current = vm.testCase.v[ vm.testCase.v.length-1 ];

        fillInitialValues();
    };

    function fillInitialValues() {
        vm.form = {
            input:  vm.testCase.current.input,
            output: vm.testCase.current.output
        };
    }

    vm.submit = function(form) {
        testCaseService.editTestCase(vm.contest.nickname, vm.problem.nickname, vm.testCase._id, {
            input:  form.input,
            output: form.output
        }).then(function(test_case) {
            $location.path($filter('url')(
                'contest.problem.testCase.view', 
                vm.contest.nickname, 
                vm.problem.nickname, 
                test_case._id
            ));
        });
    };

    vm.init();
    return vm;
}
})();
