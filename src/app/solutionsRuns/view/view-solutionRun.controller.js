(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemSolutionRunController', ViewProblemSolutionRunController);

/** @ngInject */
function ViewProblemSolutionRunController($routeParams, $filter, utilService, graphqlService) {
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
                    }
                },

                test_cases: {
                    id: true
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

            vm.loading = false;
        });

        vm.runNumber = $routeParams.run_number;
    };

    vm.urlFilter = $filter('url');

    vm.init();
    return vm;
}
})();
