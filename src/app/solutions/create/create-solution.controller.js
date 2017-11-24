(function() {
'use strict';

angular
    .module('front')
    .controller('CreateSolutionController', CreateSolutionController);

/** @ngInject */
function CreateSolutionController($location, $filter, $routeParams, languages, solutionService, graphqlService) {
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
                name:     true,
                nickname: true
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];

            vm.loading = false;
        });
        
        vm.languages = languages;

        vm.form = {};
    };

    vm.submit = function(form) {
        solutionService.createSolution(vm.contest.nickname, vm.problem.nickname, {
            name:        form.name,
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
