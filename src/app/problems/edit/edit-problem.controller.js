(function() {
'use strict';

angular
    .module('front')
    .controller('EditProblemController', EditProblemController);

/** @ngInject */
function EditProblemController($location, $filter, problemService, routeContest, routeProblem) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.lastVersion = vm.problem.v[ vm.problem.v.length-1 ];

        fillInitialValues();
    };

    function fillInitialValues() {
        vm.form = {
            name:        vm.problem.name,
            description: vm.lastVersion.description,
            time_limit:  vm.lastVersion.time_limit
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
