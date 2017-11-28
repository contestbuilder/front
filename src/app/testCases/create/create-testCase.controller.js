(function() {
'use strict';

angular
    .module('front')
    .controller('CreateTestCaseController', CreateTestCaseController);

/** @ngInject */
function CreateTestCaseController($routeParams, $scope, $location, $filter, Upload, PromiseProcess, testCaseService, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.contest = {};
        vm.problem = {};
        vm.loading = true;

        graphqlService.get({
            contest: {
                name:     true,
                nickname: true
            },

            problem: {
                name:     true,
                nickname: true,
                test_cases: {
                    id: true
                }
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nicknmae: $routeParams.problem_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];

            vm.loading = false;
        });

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

                params.input = test_case.input;
                if(test_case.inputSignedUrl) {
                    params.input_file_id = test_case.inputFile.id;
                }
                if(test_case.inputLarge) {
                    params.input_large = true;
                }

                params.output = test_case.output;
                if(test_case.outputSignedUrl) {
                    params.output_file_id = test_case.outputFile.id;
                }
                if(test_case.outputLarge) {
                    params.output_large = true;
                }

                return testCaseService.createTestCase(vm.contest.nickname, vm.problem.nickname, params)
                .then(function(test_case) {
                    return test_case.id;
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
                if(fileReader.result.length > 1024) {
                    vm.form.test_cases[index][fileType] = fileReader.result.substr(0, 1021) + '...';
                    vm.form.test_cases[index][fileType + 'Large'] = true;
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
            vm.form.test_cases[index][fileType + 'File'].id
        );
    };

    vm.getSignedUploadCallback = function(index, fileType, file) {
        return testCaseService.getUploadFileSignedUrl(
            vm.contest.nickname,
            vm.problem.nickname,
            {
                name: file.name
            }
        ).then(function(signedUrl) {
            vm.loadTestCaseFromFile(index, fileType, file);

            vm.form.test_cases[index][fileType + 'File'] = file;
            vm.form.test_cases[index][fileType + 'SignedUrl'] = signedUrl;
            vm.currentUploadingCount++;

            return signedUrl;
        });
    };

    vm.afterUploadCallback = function(index, fileType, file) {
        return testCaseService.registerFile(
            vm.contest.nickname,
            vm.problem.nickname,
            file.name
        ).then(function(fileId) {
            vm.form.test_cases[index][fileType + 'File'].id = fileId;

            vm.currentUploadingCount--;

            return true;
        });
    };

    vm.removeCallback = function(index, fileType) {
        return testCaseService.deleteFile(
            vm.contest.nickname, 
            vm.problem.nickname, 
            vm.form.test_cases[index][fileType + 'File'].id
        )
        .then(function(data) {
            delete vm.form.test_cases[index][fileType + 'File'];
            delete vm.form.test_cases[index][fileType + 'SignedUrl'];
            delete vm.form.test_cases[index][fileType + 'Large'];
            vm.form.test_cases[index][fileType] = '';

            return data;
        });
    };


    vm.init();
    return vm;
}
})();
