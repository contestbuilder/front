(function() {
'use strict';

angular
    .module('front')
    .controller('CreateProblemController', CreateProblemController);

/** @ngInject */
function CreateProblemController($location, $filter, $routeParams, problemService, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.contest = {};
        vm.loading = true;

        graphqlService.get({
            contest: {
                name:     true,
                nickname: true,

                conditions: {
                    contest_nickname: '$contest_nickname'
                }
            },
        }, {
            contest_nickname: $routeParams.contest_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];

            vm.loading = false;
        });

        fillDefaultValues();
    };

    function fillDefaultValues() {
        vm.form = {};
        vm.form.time_limit = 1;
    }

    vm.submit = function(form) {
        problemService.createProblem(vm.contest.nickname, {
            name:        form.name,
            description: form.description,
            time_limit:  form.time_limit,
            file:        form.file
        }).then(function(problem) {
            $location.path($filter('url')(
                'contest.problem.view',
                vm.contest.nickname,
                problem.nickname
            ));
        });
    };


    vm.afterUpload = function(file, filePath) {
        vm.form.file = {
            name: file.name,
            path: filePath
        };

        return Promise.resolve();
    };

    vm.removeProblemFile = function() {
        delete vm.form.file;

        return Promise.resolve();
    };

    vm.init();
    return vm;
}
})();
