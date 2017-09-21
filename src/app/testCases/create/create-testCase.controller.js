(function() {
'use strict';

angular
    .module('front')
    .controller('CreateTestCaseController', CreateTestCaseController);

/** @ngInject */
function CreateTestCaseController($scope, $location, $filter, PromiseProcess, routeContest, routeProblem, testCaseService) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;

        vm.form = {
            test_cases: [{
                input:  '',
                output: ''
            }]
        };
    };

    vm.addTestCase = function() {
        vm.form.test_cases.push({
            input:  '',
            output: ''
        });
    };

    vm.removeTestCase = function(index) {
        vm.form.test_cases.splice(index, 1);
    };

    vm.submit = function(form) {
        var promiseProcess = PromiseProcess();

        form.test_cases.forEach(function(test_case) {
            promiseProcess.push(function() {
                return testCaseService.createTestCase(vm.contest.nickname, vm.problem.nickname, {
                    input:  test_case.input,
                    output: test_case.output
                }).then(function(test_case) {
                    return test_case._id;
                });
            });
        });

        promiseProcess.exec([])
        .then(function(test_case_id) {
            $scope.$apply(function() {
                if(form.test_cases.length == 1) {
                    $location.path($filter('url')(
                        'contest.problem.testCase.view', 
                        vm.contest.nickname, 
                        vm.problem.nickname, 
                        test_case_id
                    ));
                } else {
                    $location.path($filter('url')(
                        'contest.problem.view', 
                        vm.contest.nickname, 
                        vm.problem.nickname
                    ));
                }
            });
        });
    };


    vm.loadTestCaseFromFile = function(index, fileType, file, errFiles) {
        if(!file) {
            return;
        }

        vm.form.test_cases[index][fileType + '-file'] = file.name;

        var fileReader = new FileReader();
        fileReader.onload = function(evt) {
            $scope.$apply(function () {
                vm.form.test_cases[index][fileType] = fileReader.result;
            });
        };
        fileReader.onerror = function(evt) {
        };
        fileReader.readAsText(file);
    };

    vm.unnattachTestCaseFile = function(index, fileType) {
        delete vm.form.test_cases[index][fileType + '-file'];
        vm.form.test_cases[index][fileType] = '';
    };

    vm.init();
    return vm;
}
})();
