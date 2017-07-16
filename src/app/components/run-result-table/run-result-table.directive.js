(function() {
'use strict';

angular
  .module('front')
  .directive('runResultTable', runResultTable);

/** @ngInject */
function runResultTable() {
    var directive = {
        restrict        : 'E',
        templateUrl     : 'app/components/run-result-table/run-result-table.html',
        scope           : {
            problem:   '<',
            solutions: '<',
            testCases: '<',
            runNumber: '<'
        },
        controller      : RunResultTableController,
        controllerAs    : 'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function RunResultTableController(utilService) {
        var vm = this;

        vm.init = function() {
            // if not defined which solutions should be shown, 
            // it will show all the solutions that were run.
            if(!vm.solutions) {
                vm.solutions = vm.problem.solutions.filter(function(solution) {
                    return solution.run.some(function(solutionRun) {
                        return solutionRun.run_number == vm.runNumber;
                    });
                });
            }

            // all the runs with the run_number.
            vm.solutionRuns = vm.solutions.reduce(function(prev, solution) {
                return prev.concat(
                    solution.run
                    .filter(function(solutionRun) {
                        return solutionRun.run_number == vm.runNumber;
                    })
                    .map(function(solutionRun) {
                        solutionRun.solution          = solution;
                        solutionRun.test_case         = getTestCase(vm.problem, solutionRun.test_case_id);
                        solutionRun.test_case.current = solutionRun.test_case.v[ solutionRun.test_case.v.length-1 ];

                        return solutionRun;
                    })
                );
            }, []);

            // all the test_cases that were tested.
            vm.testCases = vm.solutionRuns.reduce(function(prev, solutionRun) {
                if(prev.indexOf(solutionRun.test_case) === -1) {
                    prev.push(solutionRun.test_case);
                }
                return prev;
            }, []);

            // map with all the solution/test_case results.
            vm.solutionTestCaseRunMap = {};
        };

        function getTestCase(problem, test_case_id) {
            return problem.test_cases.filter(function(test_case) {
                return test_case._id == test_case_id;
            })[0];
        }

        vm.selectRun = function(solutionRuns, solution_id, test_case_id) {
            vm.selectedRun = vm.getSolutionTestCaseRun(solutionRuns, solution_id, test_case_id);
        };

        vm.unselectRun = function() {
            vm.selectedRun = null;
        };

        vm.getSolutionTestCaseRun = function(solutionRuns, solution_id, test_case_id) {
            if(vm.solutionTestCaseRunMap[solution_id + '-' + test_case_id] === undefined) {
                var solutionTestCaseRun = solutionRuns.filter(function(solutionRun) {
                    return solutionRun.solution._id  == solution_id
                        && solutionRun.test_case._id == test_case_id;
                })[0];

                solutionTestCaseRun.verdict = utilService.getVerdict(solutionTestCaseRun.verdict);

                vm.solutionTestCaseRunMap[solution_id + '-' + test_case_id] = solutionTestCaseRun;
            }

            return vm.solutionTestCaseRunMap[solution_id + '-' + test_case_id];
        };

        vm.init();
        return vm;
    }
}

})();
