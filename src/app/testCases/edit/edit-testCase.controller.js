(function() {
'use strict';

angular
    .module('front')
    .controller('EditTestCaseController', EditTestCaseController);

/** @ngInject */
function EditTestCaseController($routeParams, $scope, $location, $filter, graphqlService, testCaseService) {
    var vm = this;

    vm.init = function() {
        vm.contest  = {};
        vm.problem  = {};
        vm.testCase = {};
        vm.loading  = true;

        graphqlService.get({
            contest: {
                name:     true,
                nickname: true,

                conditions: {
                    contest_nickname: '$contest_nickname'
                }
            },

            problem: {
                name:     true,
                nickname: true,

                conditions: {
                    problem_nickname: '$problem_nickname'
                }
            },

            test_case: {
                id:             true,
                input:          true,
                output:         true,
                input_text_id:  true,
                output_text_id: true,
                order:          true,

                input_file: {
                    id:   true,
                    name: true,
                    path: true
                },
                output_file: {
                    id:   true,
                    name: true,
                    path: true
                },

                conditions: {
                    test_case_id: '$test_case_id'
                }
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname,
            test_case_id:     +$routeParams.test_case_id
        }).then(function(data) {
            vm.contest  = data.contest[0];
            vm.problem  = data.problem[0];
            vm.testCase = data.test_case[0];

            fillInitialValues();

            vm.loading = false;
        });

        vm.currentUploadingCount = 0;
    };

    function fillInitialValues() {
        vm.form = {
            input:  vm.testCase.input,
            output: vm.testCase.output
        };

        if(vm.testCase.input_file) {
            vm.form.inputFile = {
                original: true,
                id:       vm.testCase.input_file.id,
                name:     vm.testCase.input_file.name,
                path:     vm.testCase.input_file.path
            };
        }
        if(vm.testCase.input_text_id) {
            vm.form.inputLarge = true;
        }

        if(vm.testCase.output_file) {
            vm.form.outputFile = {
                original: true,
                id:       vm.testCase.output_file.id,
                name:     vm.testCase.output_file.name,
                path:     vm.testCase.output_file.path
            };
        }
        if(vm.testCase.output_text_id) {
            vm.form.outputLarge = true;
        }
    }

    vm.submit = function(form) {
        var params = {};

        params.input = form.input;
        if(form.inputFile) {
            params.input_file = {
                id:   form.inputFile.id,
                name: form.inputFile.name,
                path: form.inputFile.path
            };
        }
        if(form.inputLarge) {
            params.input_large = true;
        }

        params.output = form.output;
        if(form.outputFile) {
            params.output_file = {
                id:   form.outputFile.id,
                name: form.outputFile.name,
                path: form.outputFile.path
            };
        }
        if(form.outputLarge) {
            params.output_large = true;
        }

        testCaseService.editTestCase(vm.contest.nickname, vm.problem.nickname, vm.testCase.id, params)
        .then(function(test_case) {
            $location.path($filter('url')(
                'contest.problem.testCase.view', 
                vm.contest.nickname, 
                vm.problem.nickname, 
                test_case.id
            ));
        });
    };


    vm.beforeUploadCallback = function(fileType, file) {
        vm.loadTestCaseFromFile(fileType, file);

        vm.form[fileType + 'File'] = file;
        vm.currentUploadingCount++;
    };

    vm.afterUploadCallback = function(fileType, file, filePath) {
        vm.form[fileType + 'File'].path = filePath;
        vm.currentUploadingCount--;

        return Promise.resolve();
    };

    vm.removeCallback = function(fileType) {
        vm.form[fileType] = '';
        delete vm.form[fileType + 'File'];
        delete vm.form[fileType + 'Large'];

        return Promise.resolve();
    };

    vm.loadTestCaseFromFile = function(fileType, file) {
        if(!file) {
            return;
        }

        var fileReader = new FileReader();
        fileReader.onload = function(evt) {
            $scope.$apply(function () {
                if(fileReader.result.length > 1024) {
                    vm.form[fileType] = fileReader.result.substr(0, 1021) + '...';
                    vm.form[fileType + 'Large'] = true;
                } else {
                    vm.form[fileType] = fileReader.result;
                    vm.form[fileType + 'Large'] = false;
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
