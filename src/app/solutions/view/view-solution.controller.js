(function() {
'use strict';

angular
    .module('front')
    .controller('ViewSolutionController', ViewSolutionController);

/** @ngInject */
function ViewSolutionController($routeParams, utilService, graphqlService) {
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
                language:    true,
                source_code: true,

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

            vm.solution.language = utilService.getLanguage(vm.solution.language);

            vm.loading = false;
        });
    };

    vm.init();
    return vm;
}
})();
