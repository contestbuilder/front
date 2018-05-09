(function() {
'use strict';

angular
    .module('front')
    .controller('ViewCheckerController', ViewCheckerController);

/** @ngInject */
function ViewCheckerController($routeParams, utilService, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.contest = {};
        vm.problem = {};
        vm.checker = {};
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

            checker: {
                name:        true,
                nickname:    true,
                language:    true,
                source_code: true,

                conditions: {
                    checker_nickname: '$checker_nickname'
                }
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname,
            checker_nickname: $routeParams.checker_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];
            vm.checker = data.checker[0];

            vm.checker.language = utilService.getLanguage(vm.checker.language);

            vm.loading = false;
        });
    };

    vm.init();
    return vm;
}
})();