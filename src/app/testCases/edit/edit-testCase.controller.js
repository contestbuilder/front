(function() {
'use strict';

angular
    .module('front')
    .controller('EditTestCaseController', EditTestCaseController);

/** @ngInject */
function EditTestCaseController($scope, $location, $filter, routeContest, routeProblem, routeTestCase, testCaseService) {
    var vm = this;

    vm.init = function() {
        vm.contest  = routeContest;
        vm.problem  = routeProblem;
        vm.testCase = routeTestCase;

        fillInitialValues();

        vm.currentUploadingCount = 0;
    };

    function fillInitialValues() {
        vm.form = {
            input:  vm.testCase.current.sample_input + (vm.testCase.current.large_input ? '...' : ''),
            output: vm.testCase.current.sample_output + (vm.testCase.current.large_output ? '...' : '')
        };

        if(vm.testCase.current.input_file_name) {
            vm.form.inputFile = {
                original: true,
                name:     vm.testCase.current.input_file_name
            };
        }
        if(vm.testCase.current.output_file_name) {
            vm.form.outputFile = {
                original: true,
                name:     vm.testCase.current.output_file_name
            };
        }
    }

    vm.submit = function(form) {
        var params = {};

        if(form.inputFile) {
            if(form.inputSignedUrl) {
                params.input_file_name = form.inputSignedUrl.file_name;
            } else {
                params.input_file_name = form.inputFile.name;
            }
        } else {
            params.input = form.input;
        }

        if(form.outputFile) {
            if(form.outputSignedUrl) {
                params.output_file_name = form.outputSignedUrl.file_name;
            } else {
                params.output_file_name = form.outputFile.name;
            }
        } else {
            params.output = form.output;
        }

        testCaseService.editTestCase(vm.contest.nickname, vm.problem.nickname, vm.testCase._id, params)
        .then(function(test_case) {
            $location.path($filter('url')(
                'contest.problem.testCase.view', 
                vm.contest.nickname, 
                vm.problem.nickname, 
                test_case._id
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
                if(fileReader.result.length > 500) {
                    vm.form[fileType] = fileReader.result.substr(0, 497) + '...';
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
