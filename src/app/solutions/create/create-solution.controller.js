(function() {
'use strict';

angular
    .module('front')
    .controller('CreateSolutionController', CreateSolutionController);

/** @ngInject */
function CreateSolutionController($location, $routeParams, languages, solutionService, routeContest, routeProblem) {
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
            $location.path('/contests/' + vm.contest_nickname + '/problems/' + vm.problem_nickname + '/solutions/' + solution.nickname);
        });
    };

    vm.init();
    return vm;
}
})();
