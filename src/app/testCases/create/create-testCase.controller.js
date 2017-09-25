(function() {
'use strict';

angular
    .module('front')
    .controller('CreateTestCaseController', CreateTestCaseController);

/** @ngInject */
function CreateTestCaseController($scope, $location, $filter, Upload, PromiseProcess, routeContest, routeProblem, testCaseService) {
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

        vm.currentUploadingCount = 0;
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
                var params = {};

                if(test_case.inputSignedUrl) {
                    params.input_file_name = test_case.inputSignedUrl.file_name;
                } else {
                    params.input = test_case.input;
                }

                if(test_case.outputSignedUrl) {
                    params.output_file_name = test_case.outputSignedUrl.file_name;
                } else {
                    params.output = test_case.output;
                }

                return testCaseService.createTestCase(vm.contest.nickname, vm.problem.nickname, params)
                .then(function(test_case) {
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


    vm.loadTestCaseFromFile = function(index, fileType, file) {
        if(!file) {
            return;
        }

        var fileReader = new FileReader();
        fileReader.onload = function(evt) {
            $scope.$apply(function () {
                if(fileReader.result.length > 500) {
                    vm.form.test_cases[index][fileType] = fileReader.result.substr(0, 497) + '...';
                } else {
                    vm.form.test_cases[index][fileType] = fileReader.result;
                }
            });
        };
        fileReader.onerror = function(evt) {
        };
        fileReader.readAsText(file);
    };

    vm.getSignedDownloadCallback = function(index, fileType) {
        return testCaseService.getDownloadFileSignedUrl(
            vm.contest.nickname, 
            vm.problem.nickname, 
            vm.form.test_cases[index][fileType + 'SignedUrl'].file_name
        );
    };

    vm.getSignedUploadCallback = function(index, fileType, file) {
        return testCaseService.getUploadFileSignedUrl(vm.contest.nickname, vm.problem.nickname, {})
            .then(function(signedUrl) {
                vm.loadTestCaseFromFile(index, fileType, file);

                vm.form.test_cases[index][fileType + 'File'] = file;
                vm.form.test_cases[index][fileType + 'SignedUrl'] = signedUrl;
                vm.currentUploadingCount++;

                return signedUrl;
            });
    };

    vm.afterUploadCallback = function(index, fileType, file) {
        vm.currentUploadingCount--;

        return Promise.resolve();
    };

    vm.removeCallback = function(index, fileType) {
        return testCaseService.deleteFile(
            vm.contest.nickname, 
            vm.problem.nickname, 
            vm.form.test_cases[index][fileType + 'SignedUrl'].file_name
        )
        .then(function(data) {
            delete vm.form.test_cases[index][fileType + 'File'];
            delete vm.form.test_cases[index][fileType + 'SignedUrl'];
            vm.form.test_cases[index][fileType] = '';

            return data;
        });
    };


    vm.init();
    return vm;
}
})();
