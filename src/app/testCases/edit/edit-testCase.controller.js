(function() {
'use strict';

angular
    .module('front')
    .controller('EditTestCaseController', EditTestCaseController);

/** @ngInject */
function EditTestCaseController($scope, $location, $filter, graphqlService, testCaseService) {
    var vm = this;

    vm.init = function() {
        vm.contest = {};
        vm.problem = {};
        vm.testCase = {};
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
                input:  true,
                output: true,
                order:  true
            }
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];
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
                name:     vm.testCase.input_file
            };
        }
        if(vm.testCase.output_file) {
            vm.form.outputFile = {
                original: true,
                name:     vm.testCase.output_file
            };
        }
    }

    vm.submit = function(form) {
        var params = {};

        if(form.inputFile) {
            if(form.inputSignedUrl) {
                params.input_file = form.inputSignedUrl.file_name;
            } else {
                params.input_file = form.inputFile.name;
            }
        } else {
            params.input = form.input;
        }

        if(form.outputFile) {
            if(form.outputSignedUrl) {
                params.output_file = form.outputSignedUrl.file_name;
            } else {
                params.output_file = form.outputFile.name;
            }
        } else {
            params.output = form.output;
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
                } else {
                    vm.form[fileType] = fileReader.result;
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
            vm.form.inputFile.name
        );
    };

    vm.getSignedUploadCallback = function(fileType, file) {
        return testCaseService.getUploadFileSignedUrl(vm.contest.nickname, vm.problem.nickname, {})
            .then(function(signedUrl) {
                vm.loadTestCaseFromFile(fileType, file);

                vm.form[fileType + 'File'] = file;
                vm.form[fileType + 'SignedUrl'] = signedUrl;
                vm.currentUploadingCount++;

                return signedUrl;
            });
    };

    vm.afterUploadCallback = function(fileType, file) {
        vm.currentUploadingCount--;

        return Promise.resolve();
    };

    vm.removeCallback = function(fileType) {
        if(vm.form[fileType + 'File'].original) {
            delete vm.form[fileType + 'File'];
            vm.form[fileType] = '';

            return Promise.resolve();
        }

        return testCaseService.deleteFile(
            vm.contest.nickname, 
            vm.problem.nickname, 
            vm.form[fileType + 'SignedUrl'].file_name
        )
        .then(function(data) {
            delete vm.form[fileType + 'File'];
            delete vm.form[fileType + 'SignedUrl'];
            vm.form[fileType] = '';

            return data;
        });
    };

    vm.init();
    return vm;
}
})();
