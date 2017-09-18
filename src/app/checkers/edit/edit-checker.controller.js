(function() {
'use strict';

angular
    .module('front')
    .controller('EditCheckerController', EditCheckerController);

/** @ngInject */
function EditCheckerController($location, $filter, languages, checkerService, routeContest, routeProblem, routeChecker) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.checker = routeChecker;
        vm.checker.current = vm.checker.v[ vm.checker.v.length-1 ];

        vm.languages = languages;
        fillInitialValues();
    };

    function fillInitialValues() {
        vm.form = {
            source_code: vm.checker.current.source_code,
            language:    vm.checker.current.language
        };
    }

    vm.submit = function(form) {
        checkerService.editChecker(vm.contest.nickname, vm.problem.nickname, vm.checker.nickname, {
            source_code: form.source_code,
            language:    form.language
        }).then(function(checker) {
            $location.path($filter('url')(
                'contest.problem.checker.view',
                vm.contest.nickname,
                vm.problem.nickname,
                checker.nickname
            ));
        });
    };

    vm.init();
    return vm;
}
})();
