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
                nickname: true
            },

            problem: {
                name:        true,
                nickname:    true,
                description: true,
                time_limit:  true
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
            time_limit:  vm.problem.time_limit
        };
    }

    vm.submit = function(form) {
        problemService.editProblem(vm.contest.nickname, vm.problem.nickname, {
            name:        form.name,
            description: form.description,
            time_limit:  form.time_limit
        }).then(function(problem) {
            $location.path($filter('url')(
                'contest.problem.view',
                vm.contest.nickname,
                problem.nickname
            ));
        });
    };

    vm.init();
    return vm;
}
})();
