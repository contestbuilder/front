(function() {
'use strict';

angular
    .module('front')
    .controller('CreateProblemController', CreateProblemController);

/** @ngInject */
function CreateProblemController($location, $filter, $routeParams, problemService, routeContest) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.contest_nickname = $routeParams.contest_nickname;

        fillDefaultValues();
    };

    function fillDefaultValues() {
        vm.form = {};
        vm.form.time_limit = 1;
    }

    vm.submit = function(form) {
        problemService.createProblem(vm.contest_nickname, {
            name:        form.name,
            description: form.description,
            time_limit:  form.time_limit
        }).then(function(problem) {
            $location.path($filter('url')(
                'contest.problem.view',
                vm.contest_nickname,
                problem.nickname
            ));
        });
    };

    vm.init();
    return vm;
}
})();
