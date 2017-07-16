(function() {
'use strict';

angular
    .module('front')
    .controller('CreateProblemController', CreateProblemController);

/** @ngInject */
function CreateProblemController($location, $routeParams, problemService, routeContest) {
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
            $location.path('/contests/' + vm.contest_nickname + '/problems/' + problem.nickname);
        });
    };

    vm.init();
    return vm;
}
})();
