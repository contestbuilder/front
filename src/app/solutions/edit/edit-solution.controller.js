(function() {
'use strict';

angular
    .module('front')
    .controller('EditSolutionController', EditSolutionController);

/** @ngInject */
function EditSolutionController($location, $filter, languages, solutionService, routeContest, routeProblem, routeSolution) {
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
            source_code: vm.solution.current.source_code,
            language:    vm.solution.current.language
        };
    }

    vm.submit = function(form) {
        solutionService.editSolution(vm.contest.nickname, vm.problem.nickname, vm.solution.nickname, {
            source_code: form.source_code,
            language:    form.language
        }).then(function(solution) {
            $location.path($filter('url')(
                'contest.problem.solution.view',
                vm.contest.nickname,
                vm.problem.nickname,
                solution.nickname
            ));
        });
    };


    vm.loadCallback = function(err, content) {
        if(err) {
            return;
        }

        vm.form.source_code = content;
    };

    vm.removeCallback = function() {
        delete vm.form.file;
        vm.form.source_code = '';
    };

    vm.init();
    return vm;
}
})();
