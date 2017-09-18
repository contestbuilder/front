(function() {
'use strict';

angular
    .module('front')
    .controller('CreateCheckerController', CreateCheckerController);

/** @ngInject */
function CreateCheckerController($location, $filter, $routeParams, languages, checkerService, routeContest, routeProblem) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        
        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;

        vm.languages = languages;
    };

    vm.submit = function(form) {
        checkerService.createChecker(vm.contest_nickname, vm.problem_nickname, {
            name:        form.name,
            source_code: form.source_code,
            language:    form.language
        }).then(function(checker) {
            $location.path($filter('url')(
                'contest.problem.checker.view',
                vm.contest_nickname,
                vm.problem_nickname,
                checker.nickname
            ));
        });
    };

    vm.init();
    return vm;
}
})();
