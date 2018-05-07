(function() {
'use strict';

angular
    .module('front')
    .controller('ViewSolutionRunController', ViewSolutionRunController);

/** @ngInject */
function ViewSolutionRunController($routeParams, $filter, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.contest = {};
        vm.problem = {};
        vm.solution = {};
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

                test_cases: {
                    id: true
                },

                conditions: {
                    problem_nickname: '$problem_nickname'
                }
            },

            solution: {
                id:       true,
                name:     true,
                nickname: true,

                runs: {
                    number:  true,
                    verdict: true,
                    output:  true,

                    test_case: {
                        id:     true,
                        input:  true,
                        output: true,
                        order:  true
                    }
                },

                conditions: {
                    solution_nickname: '$solution_nickname'
                }
            }
        }, {
            contest_nickname:  $routeParams.contest_nickname,
            problem_nickname:  $routeParams.problem_nickname,
            solution_nickname: $routeParams.solution_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];
            vm.solution = data.solution[0];

            vm.loading = false;
        });

        vm.runNumber = $routeParams.run_number;

        vm.urlFilter = $filter('url');
    };

    vm.init();
    return vm;
}
})();
