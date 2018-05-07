(function() {
'use strict';

angular
    .module('front')
    .controller('CreateSolutionController', CreateSolutionController);

/** @ngInject */
function CreateSolutionController($location, $scope, $filter, $routeParams, languages, solutionService, graphqlService) {
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
                name:     true,
                nickname: true,

                conditions: {
                    problem_nickname: '$problem_nickname'
                }
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];

            vm.loading = false;
        });
        
        vm.languages = languages;

        vm.form = {};
    };

    vm.submit = function(form) {
        var data = {
            name:        form.name,
            source_code: form.source_code,
            language:    form.language
        };

        if(form.file) {
            data.file = {
                name:  form.file.name,
                path:  form.file.path,
                large: !!form.sourceCodeLarge
            };
        }

        solutionService.createSolution(vm.contest.nickname, vm.problem.nickname, data)
        .then(function(solution) {
            $location.path($filter('url')(
                'contest.problem.solution.view',
                vm.contest.nickname,
                vm.problem.nickname,
                solution.nickname
            ));
        });
    };


    vm.beforeUploadCallback = function(file) {
        vm.loadFromFile(file);

        vm.form.file = file;
        vm.currentUploadingCount++;
    };

    vm.afterUploadCallback = function(file, filePath) {
        vm.form.file.path = filePath;
        vm.currentUploadingCount--;

        return Promise.resolve();
    };

    vm.removeCallback = function() {
        vm.form.source_code = '';
        delete vm.form.file;
        delete vm.form.sourceCodeLarge;

        return Promise.resolve();
    };


    vm.loadFromFile = function(file) {
        if(!file) {
            return;
        }

        var fileReader = new FileReader();
        fileReader.onload = function(evt) {
            $scope.$apply(function () {
                if(fileReader.result.length > 4000) {
                    vm.form.source_code = fileReader.result.substr(0, 3997) + '...';
                    vm.form.sourceCodeLarge = true;
                } else {
                    vm.form.source_code = fileReader.result;
                    vm.form.sourceCodeLarge = false;
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
