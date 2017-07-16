(function() {
'use strict';

angular
  .module('front')
  .directive('runsList', runsList);

/** @ngInject */
function runsList() {
    var directive = {
        restrict        : 'E',
        templateUrl     : 'app/components/runs-list/runs-list.html',
        scope           : {
            runs:    '<',
            getLink: '<'
        },
        controller      : RunsListController,
        controllerAs    : 'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function RunsListController(utilService) {
        var vm = this;

        vm.init = function() {
            vm.solutionRuns = [];
            for(var i=0; i<vm.runs.length; i++) {
                var newSolutionRun = {
                    run_number: vm.runs[i].run_number,
                    runs:       [ vm.runs[i] ],
                    timestamp:  vm.runs[i].timestamp
                };

                for(var j=vm.runs.length-1; j>i; j--) {
                    if(vm.runs[i].run_number === vm.runs[j].run_number) {
                        newSolutionRun.runs.push(vm.runs[j]);
                        vm.runs.splice(j, 1);
                    }
                }

                vm.solutionRuns.push(newSolutionRun);
            }
            vm.solutionRuns.sort(function(a, b) {
                return b.run_number - a.run_number;
            });
        };

        vm.init();
        return vm;
    }
}

})();
