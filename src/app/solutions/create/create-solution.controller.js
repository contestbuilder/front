(function() {
'use strict';

angular
    .module('front')
    .controller('CreateSolutionController', CreateSolutionController);

/** @ngInject */
function CreateSolutionController($location, $filter, $routeParams, languages, solutionService, routeContest, routeProblem) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        
        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;

        vm.languages = languages;
    };

    vm.submit = function(form) {
        solutionService.createSolution(vm.contest_nickname, vm.problem_nickname, {
            name:        form.name,
            source_code: form.source_code,
            language:    form.language
        }).then(function(solution) {
            $location.path($filter('url')(
                'contest.problem.solution.view',
                vm.contest_nickname,
                vm.problem_nickname,
                solution.nickname
            ));
        });
    };

    vm.init();
    return vm;
}
})();
