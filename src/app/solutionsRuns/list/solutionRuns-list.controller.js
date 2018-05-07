(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemSolutionRunsController', ViewProblemSolutionRunsController);

/** @ngInject */
function ViewProblemSolutionRunsController($routeParams, $filter, utilService, graphqlService) {
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

                solutions: {
                    name: true,

                    runs: {
                        number:    true,
                        timestamp: true
                    }
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

            vm.runs = angular.copy(vm.problem.solutions.reduce(function(prev, solution) {
                return prev.concat(solution.runs);
            }, []));

            vm.loading = false;
        });
    };

    vm.getRunLink = function(number) {
        return $filter('url')('contest.problem.solutionRun.view', vm.contest.nickname, vm.problem.nickname, number);
    };

    vm.init();
    return vm;
}
})();
