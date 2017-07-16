(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemSolutionRunController', ViewProblemSolutionRunController);

/** @ngInject */
function ViewProblemSolutionRunController($routeParams, $filter, utilService, routeContest, routeProblem) {
    var vm = this;

    vm.init = function() {
        vm.contest   = routeContest;
        vm.problem   = routeProblem;
        vm.runNumber = $routeParams.run_number;
    };

    vm.urlFilter = $filter('url');

    vm.init();
    return vm;
}
})();
