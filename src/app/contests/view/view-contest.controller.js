(function() {
'use strict';

angular
    .module('front')
    .controller('ViewContestController', ViewContestController);

/** @ngInject */
function ViewContestController(contestService, contributorService, problemService, routeMe, routeContest) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.contest = routeContest;
    };

    vm.canI = function(action, obj) {
        switch(action) {
            case 'delete_contributor':
                return vm.contest.author._id == vm.me._id;
            case 'delete_problem':
                return vm.contest.author._id == vm.me._id;
            default:
                return false;
        }
    };

    vm.deleteContributor = function(contributor) {
        return function() {
            contributorService.deleteContributor(vm.contest.nickname, contributor._id)
            .then(function(contest) {
                vm.contest = contest;
            });
        };
    };

    vm.deleteProblem = function(problem) {
        return function() {
            problemService.deleteProblem(vm.contest.nickname, problem.nickname)
            .then(function(contest) {
                vm.contest = contest;
            });
        };
    };

    vm.deleteContest = function() {
        return function() {
            contestService.deleteContest(vm.contest.nickname)
            .then(function(contest) {
                vm.contest = contest;
            });
        };
    };

    vm.init();
    return vm;
}
})();
