(function() {
'use strict';

angular
    .module('front')
    .controller('ViewSolutionRunsController', ViewSolutionRunsController);

/** @ngInject */
function ViewSolutionRunsController($routeParams, $filter, utilService, graphqlService) {
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

                conditions: {
                    problem_nickname: '$problem_nickname'
                }
            },

            solution: {
                name:     true,
                nickname: true,

                runs: {
                    number:    true,
                    timestamp: true
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

            vm.runs = angular.copy(vm.solution.runs);

            vm.loading = false;
        });
    };

    vm.getRunLink = function(number) {
        return $filter('url')('contest.problem.solution.run.view', vm.contest.nickname, vm.problem.nickname, vm.solution.nickname, number);
    };

    vm.init();
    return vm;
}
})();
