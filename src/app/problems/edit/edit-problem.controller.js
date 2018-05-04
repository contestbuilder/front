(function() {
'use strict';

angular
    .module('front')
    .controller('EditProblemController', EditProblemController);

/** @ngInject */
function EditProblemController($routeParams, $location, $filter, problemService, graphqlService) {
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
                name:        true,
                nickname:    true,
                description: true,
                time_limit:  true,

                file: {
                    id:   true,
                    name: true
                },

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

            fillInitialValues();

            vm.loading = false;
        });
    };

    function fillInitialValues() {
        vm.form = {
            name:        vm.problem.name,
            description: vm.problem.description,
            time_limit:  vm.problem.time_limit,
            file:        vm.problem.file,
            new_file:    null
        };
    }

    vm.submit = function(form) {
        problemService.editProblem(vm.contest.nickname, vm.problem.nickname, {
            name:        form.name,
            description: form.description,
            time_limit:  form.time_limit,
            file:        form.file,
            new_file:    form.new_file
        }).then(function(problem) {
            $location.path($filter('url')(
                'contest.problem.view',
                vm.contest.nickname,
                problem.nickname
            ));
        });
    };


    vm.afterUpload = function(file, filePath) {
        vm.form.new_file = {
            name: file.name,
            path: filePath
        };

        return Promise.resolve();
    };

    vm.removeProblemFile = function() {
        delete vm.form.file;

        return Promise.resolve();
    };

    vm.init();
    return vm;
}
})();
