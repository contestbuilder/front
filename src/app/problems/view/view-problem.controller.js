(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemController', ViewProblemController);

/** @ngInject */
function ViewProblemController($routeParams, routeContest, routeProblem, solutionService, testCaseService, solutionRunsService) {
    var vm = this;

    vm.init = function() {
        vm.contest = routeContest;
        vm.problem = routeProblem;
        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;

        vm.problem.current = vm.problem.v[vm.problem.v.length-1];

        getValidatedTestCases(vm.problem, vm.problem.solutions);
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
            });
        };
    };

    vm.runSolution = function(solution_index) {
        var validationResult;
        vm.problem.solutions[solution_index].validation = {
            status: 'waiting'
        };

        solutionRunsService.runSolutions(vm.contest.nickname, vm.problem.nickname, {
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

    vm.deleteTestCase = function(test_case) {
        return function() {
            testCaseService.deleteTestCase(vm.contest_nickname, vm.problem_nickname, test_case._id)
            .then(function(contest) {
                vm.contest = contest;
                vm.problem = vm.contest.problems.filter(function(problem) {
                    return problem.nickname == vm.problem_nickname;
                })[0];
                getValidatedTestCases(vm.problem, vm.problem.solutions);
            });
        };
    };

    function getValidatedTestCases(problem, solutions) {
        solutions.forEach(function(solution) {
            if(solution.validatedTestCases !== undefined) {
                return;
            }

            solution.validatedTestCases = solutionRunsService.getValidatedTestCases(problem, solution);
        });
    }

    vm.init();
    return vm;
}
})();
