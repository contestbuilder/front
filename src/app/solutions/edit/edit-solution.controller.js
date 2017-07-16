(function() {
'use strict';

angular
    .module('front')
    .controller('EditSolutionController', EditSolutionController);

/** @ngInject */
function EditSolutionController($location, languages, solutionService, routeContest, routeProblem, routeSolution) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.solution = routeSolution;
        vm.solution.current = vm.solution.v[ vm.solution.v.length-1 ];

        vm.languages = languages;
        fillInitialValues();
    };

    function fillInitialValues() {
        vm.form = {
            name:        vm.solution.name,
            source_code: vm.solution.current.source_code,
            language:    vm.solution.current.language
        };
    }

    vm.submit = function(form) {
        solutionService.editSolution(vm.contest.nickname, vm.problem.nickname, vm.solution.nickname, {
            name:        form.name,
            source_code: form.source_code,
            language:    form.language
        }).then(function(solution) {
            $location.path('/contests/' + vm.contest.nickname + '/problems/' + vm.problem.nickname + '/solutions/' + solution.nickname);
        });
    };

    vm.init();
    return vm;
}
})();
