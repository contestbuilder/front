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
            checkers:  '<',
            testCases: '<',
            runNumber: '<',

            customExpectedOutput: '<'
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
            if(typeof vm.solutions === 'boolean' && vm.solutions) {
                vm.items = vm.problem.solutions.filter(function(solution) {
                    return solution.run.some(function(solutionRun) {
                        return solutionRun.run_number == vm.runNumber;
                    });
                });
            } else if(Array.isArray(vm.solutions)) {
                vm.items = vm.solutions;
            }

            // if not defined which checkers should be shown, 
            // it will show all the checkers that were run.
            if(typeof vm.checkers === 'boolean' && vm.checkers) {
                vm.items = vm.problem.checkers.filter(function(solution) {
                    return solution.run.some(function(solutionRun) {
                        return solutionRun.run_number == vm.runNumber;
                    });
                });
            } else if(Array.isArray(vm.checkers)) {
                vm.items = vm.checkers;
            }

            // all the runs with the run_number.
            vm.runs = vm.items.reduce(function(prev, item) {
                return prev.concat(
                    item.run
                    .filter(function(itemRun) {
                        return itemRun.run_number == vm.runNumber;
                    })
                    .map(function(itemRun) {
                        itemRun.item              = item;
                        itemRun.test_case         = getTestCase(vm.problem, itemRun.test_case_id);
                        itemRun.test_case.current = itemRun.test_case.v[ itemRun.test_case.v.length-1 ];

                        return itemRun;
                    })
                );
            }, []);

            // all the test_cases that were tested.
            vm.testCases = vm.runs.reduce(function(prev, solutionRun) {
                if(prev.indexOf(solutionRun.test_case) === -1) {
                    prev.push(solutionRun.test_case);
                }
                return prev;
            }, []);

            // map with all the item/test_case results.
            vm.testCaseRunMap = {};
        };

        function getTestCase(problem, test_case_id) {
            return problem.test_cases.filter(function(test_case) {
                return test_case._id == test_case_id;
            })[0];
        }

        vm.selectRun = function(runs, item_id, test_case_id) {
            vm.selectedRun = vm.getTestCaseRun(runs, item_id, test_case_id);
        };

        vm.unselectRun = function() {
            vm.selectedRun = null;
        };

        vm.getTestCaseRun = function(runs, item_id, test_case_id) {
            if(vm.testCaseRunMap[item_id + '-' + test_case_id] === undefined) {
                var testCaseRun = runs.filter(function(run) {
                    return run.item._id  == item_id
                        && run.test_case._id == test_case_id;
                })[0];

                testCaseRun.verdict = utilService.getVerdict(testCaseRun.verdict);

                vm.testCaseRunMap[item_id + '-' + test_case_id] = testCaseRun;
            }

            return vm.testCaseRunMap[item_id + '-' + test_case_id];
        };

        vm.init();
        return vm;
    }
}

})();
