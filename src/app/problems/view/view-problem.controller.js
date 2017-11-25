(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemController', ViewProblemController);

/** @ngInject */
function ViewProblemController($routeParams, downloadService, graphqlService, problemService, solutionService, checkerService, testCaseService, runService) {
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
                name:        true,
                nickname:    true,
                description: true,
                file_url:    true,
                time_limit:  true,
                deleted_at:  true,

                solutions: {
                    name:     true,
                    nickname: true
                },

                test_cases: {
                    id: true
                }

                // checkers
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];

            getValidatedTestCases(vm.problem, []);//vm.problem.solutions);
            getValidatedTestCases(vm.problem, []);//vm.problem.checkers);

            vm.loading = false;
        });

        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;
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
            testCaseService.deleteTestCase(vm.contest_nickname, vm.problem_nickname, test_case.id)
            .then(function(success) {
                return;
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


    vm.getSignedDownloadUrl = function() {
        return problemService.downloadProblemFile(vm.contest.nickname, vm.problem.nickname);
    };

    vm.getSignedUploadUrl = function(file) {
        return problemService.getUploadProblemFileSignedUrl(vm.contest.nickname, vm.problem.nickname, {
            name: file.name
        });
    };

    vm.uploadProblemFile = function(file) {
        return problemService.uploadProblemFile(vm.contest.nickname, vm.problem.nickname, {
            name: file.name
        });
    };

    vm.removeProblemFile = function() {
        return problemService.deleteProblemFile(vm.contest.nickname, vm.problem.nickname);
    };


    vm.init();
    return vm;
}
})();
