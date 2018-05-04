(function() {
'use strict';

angular
    .module('front')
    .controller('EditSolutionController', EditSolutionController);

/** @ngInject */
function EditSolutionController($routeParams, $location, $filter, languages, solutionService, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.contest  = {};
        vm.problem  = {};
        vm.solution = {};
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

            solution: {
                name:        true,
                nickname:    true,
                source_code: true,
                language:    true,

                conditions: {
                    solution_nickname: '$solution_nickname'
                }
            }
        }, {
            contest_nickname:  $routeParams.contest_nickname,
            problem_nickname:  $routeParams.problem_nickname,
            solution_nickname: $routeParams.solution_nickname
        }).then(function(data) {
            vm.contest  = data.contest[0];
            vm.problem  = data.problem[0];
            vm.solution = data.solution[0];

            fillInitialValues();

            vm.loading = false;
        });

        vm.languages = languages;
    };

    function fillInitialValues() {
        vm.form = {
            source_code: vm.solution.source_code,
            language:    vm.solution.language
        };
    }

    vm.submit = function(form) {
        solutionService.editSolution(vm.contest.nickname, vm.problem.nickname, vm.solution.nickname, {
            source_code: form.source_code,
            language:    form.language
        }).then(function(solution) {
            $location.path($filter('url')(
                'contest.problem.solution.view',
                vm.contest.nickname,
                vm.problem.nickname,
                solution.nickname
            ));
        });
    };


    vm.loadCallback = function(err, content) {
        if(err) {
            return;
        }

        vm.form.source_code = content;
    };

    vm.removeCallback = function() {
        delete vm.form.file;
        vm.form.source_code = '';
    };

    vm.init();
    return vm;
}
})();
