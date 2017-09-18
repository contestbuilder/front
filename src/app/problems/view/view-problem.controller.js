(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemController', ViewProblemController);

/** @ngInject */
function ViewProblemController($routeParams, routeContest, routeProblem, solutionService, checkerService, testCaseService, runService) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;

        vm.problem.current = vm.problem.v[vm.problem.v.length-1];

        getValidatedTestCases(vm.problem, vm.problem.solutions);
        getValidatedTestCases(vm.problem, vm.problem.checkers);
    };

    vm.deleteSolution = function(solution) {
        return function() {
            solutionService.deleteSolution(vm.contest_nickname, vm.problem_nickname, solution.nickname)
            .then(function(contest) {
                vm.contest = contest;
                vm.problem = vm.contest.problems.filter(function(problem) {
                    return problem.nickname == vm.problem_nickname;
                })[0];
                getValidatedTestCases(vm.problem, vm.problem.solutions);
                getValidatedTestCases(vm.problem, vm.problem.checkers);
            });
        };
    };

    vm.deleteChecker = function(checker) {
        return function() {
            checkerService.deleteChecker(vm.contest_nickname, vm.problem_nickname, checker.nickname)
            .then(function(contest) {
                vm.contest = contest;
                vm.problem = vm.contest.problems.filter(function(problem) {
                    return problem.nickname == vm.problem_nickname;
                })[0];
                getValidatedTestCases(vm.problem, vm.problem.solutions);
                getValidatedTestCases(vm.problem, vm.problem.checkers);
            });
        };
    };

    vm.runSolution = function(solution_index) {
        var validationResult;
        vm.problem.solutions[solution_index].validation = {
            status: 'waiting'
        };

        runService.runSolutions(vm.contest.nickname, vm.problem.nickname, {
            solutions:  [ vm.problem.solutions[solution_index].nickname ],
            test_cases: vm.problem.test_cases.reduce(function(prev, cur) {
                prev.push(cur._id);
                return prev;
            }, [])
        })
        .then(function(results) {
            validationResult = results;

            return solutionService.getSolution(
                vm.contest_nickname, 
                vm.problem_nickname, 
                vm.problem.solutions[solution_index].nickname
            );
        })
        .then(function(solution) {
            vm.problem.solutions[solution_index] = solution;
            getValidatedTestCases(vm.problem, vm.problem.solutions);

            vm.problem.solutions[solution_index].validation = {
                status: 'done',
                result: validationResult
            };
        });
    };

    vm.runChecker = function(checker_index) {
        var validationResult;
        vm.problem.checkers[checker_index].validation = {
            status: 'waiting'
        };

        runService.runCheckers(vm.contest.nickname, vm.problem.nickname, {
            checkers:   [ vm.problem.checkers[checker_index].nickname ],
            test_cases: vm.problem.test_cases.reduce(function(prev, cur) {
                prev.push(cur._id);
                return prev;
            }, [])
        })
        .then(function(results) {
            validationResult = results;

            return checkerService.getChecker(
                vm.contest_nickname, 
                vm.problem_nickname, 
                vm.problem.checkers[checker_index].nickname
            );
        })
        .then(function(checker) {
            vm.problem.checkers[checker_index] = checker;
            getValidatedTestCases(vm.problem, vm.problem.checkers);

            vm.problem.checkers[checker_index].validation = {
                status: 'done',
                result: validationResult
            };
        });
    };

    vm.deleteTestCase = function(test_case) {
        return function() {
            testCaseService.deleteTestCase(vm.contest_nickname, vm.problem_nickname, test_case._id)
            .then(function(contest) {
                vm.contest = contest;
                vm.problem = vm.contest.problems.filter(function(problem) {
                    return problem.nickname == vm.problem_nickname;
                })[0];
                getValidatedTestCases(vm.problem, vm.problem.solutions);
                getValidatedTestCases(vm.problem, vm.problem.checkers);
            });
        };
    };

    function getValidatedTestCases(problem, items) {
        items.forEach(function(item) {
            if(item.validatedTestCases !== undefined) {
                return;
            }

            item.validatedTestCases = runService.getValidatedTestCases(problem, item.run, item.v);
        });
    }

    vm.init();
    return vm;
}
})();
