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
                order:          true,
                input_text_id:  true,
                output_text_id: true,

                input_file: {
                    id:   true,
                    name: true
                },
                output_file: {
                    id:   true,
                    name: true
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
                name:     vm.testCase.input_file.name
            };
        }
        if(vm.testCase.input_text_id) {
            vm.form.inputLarge = true;
        }

        if(vm.testCase.output_file) {
            vm.form.outputFile = {
                original: true,
                id:       vm.testCase.output_file.id,
                name:     vm.testCase.output_file.name
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
            params.input_file_id = form.inputFile.id;
        }
        if(form.inputLarge) {
            params.input_large = true;
        }

        params.output = form.output;
        if(form.outputFile) {
            params.output_file_id = form.outputFile.id;
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

    vm.getSignedDownloadCallback = function(fileType) {
        return testCaseService.getDownloadFileSignedUrl(
            vm.contest.nickname, 
            vm.problem.nickname, 
            vm.form[fileType + 'File'].id
        );
    };

    vm.getSignedUploadCallback = function(fileType, file) {
        return testCaseService.getUploadFileSignedUrl(
            vm.contest.nickname, 
            vm.problem.nickname,
            {
                name: file.name
            }
        ).then(function(signedUrl) {
            vm.loadTestCaseFromFile(fileType, file);

            vm.form[fileType + 'File'] = file;
            vm.form[fileType + 'SignedUrl'] = signedUrl;
            vm.currentUploadingCount++;

            return signedUrl;
        });
    };

    vm.afterUploadCallback = function(fileType, file) {
        return testCaseService.registerFile(
            vm.contest.nickname,
            vm.problem.nickname,
            file.name
        ).then(function(fileId) {
            vm.form[fileType + 'File'].id = fileId;

            vm.currentUploadingCount--;

            return true;
        });
    };

    vm.removeCallback = function(fileType) {
        if(vm.form[fileType + 'File'].original) {
            delete vm.form[fileType + 'File'];
            delete vm.form[fileType + 'Large'];
            vm.form[fileType] = '';

            return Promise.resolve();
        }

        return testCaseService.deleteFile(
            vm.contest.nickname, 
            vm.problem.nickname, 
            vm.form[fileType + 'File'].id
        )
        .then(function(data) {
            delete vm.form[fileType + 'File'];
            delete vm.form[fileType + 'SignedUrl'];
            delete vm.form[fileType + 'Large'];
            vm.form[fileType] = '';

            return data;
        });
    };

    vm.init();
    return vm;
}
})();
