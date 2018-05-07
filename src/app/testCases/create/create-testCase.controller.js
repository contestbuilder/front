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
                nickname: true,

                conditions: {
                    contest_nickname: '$contest_nickname'
                }
            },

            problem: {
                name:       true,
                nickname:   true,
                test_cases: {
                    id: true,

                    conditions: {
                        show_deleted: '$show_deleted'
                    }
                },

                conditions: {
                    problem_nickname: '$problem_nickname'
                }
            }
        }, {
            contest_nickname:  $routeParams.contest_nickname,
            problem_nickname:  $routeParams.problem_nickname,
            show_deleted:      false
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
                if(test_case.inputFile) {
                    params.input_file = {
                        name: test_case.inputFile.name,
                        path: test_case.inputFile.path
                    };
                }
                if(test_case.inputLarge) {
                    params.input_large = true;
                }

                params.output = test_case.output;
                if(test_case.outputFile) {
                    params.output_file = {
                        name: test_case.outputFile.name,
                        path: test_case.outputFile.path
                    };
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


    vm.beforeUploadCallback = function(index, fileType, file) {
        vm.loadTestCaseFromFile(index, fileType, file);

        vm.form.test_cases[index][fileType + 'File'] = file;
        vm.currentUploadingCount++;
    };

    vm.afterUploadCallback = function(index, fileType, file, filePath) {
        vm.form.test_cases[index][fileType + 'File'].path = filePath;
        vm.currentUploadingCount--;

        return Promise.resolve();
    };

    vm.removeCallback = function(index, fileType) {
        vm.form.test_cases[index][fileType] = '';
        delete vm.form.test_cases[index][fileType + 'File'];
        delete vm.form.test_cases[index][fileType + 'Large'];

        return Promise.resolve();
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
                    vm.form.test_cases[index][fileType + 'Large'] = false;
                }
            });
        };
        fileReader.onerror = function(evt) {
        };
        fileReader.readAsText(file);
    };


    vm.init();
    return vm;
}
})();
