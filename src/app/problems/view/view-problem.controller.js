(function() {
'use strict';

angular
    .module('front')
    .controller('ViewProblemController', ViewProblemController);

/** @ngInject */
function ViewProblemController($routeParams, fileService, downloadService, graphqlService, solutionService, checkerService, testCaseService, runService) {
    var vm = this;

    vm.init = function() {
        vm.contest = {};
        vm.problem = {};
        vm.loading = true;

        vm.contest_nickname = $routeParams.contest_nickname;
        vm.problem_nickname = $routeParams.problem_nickname;

        updateProblem();
    };

    function updateProblem() {
        graphqlService.get({
            contest: {
                name:     true,
                nickname: true,

                conditions: {
                    contest_nickname: '$contest_nickname'
                }
            },

            problem: {
                name:        true,
                nickname:    true,
                description: true,
                time_limit:  true,
                deleted_at:  true,

                file: {
                    name: true,
                    path: true
                },

                solutions: {
                    name:       true,
                    nickname:   true,
                    last_edit:  true,
                    deleted_at: true,

                    runs: {
                        id:        true,
                        number:    true,
                        success:   true,
                        verdict:   true,
                        timestamp: true,

                        test_case: {
                            id: true
                        }
                    }
                },

                test_cases: {
                    id:         true,
                    order:      true,
                    last_edit:  true,
                    deleted_at: true
                },

                // checkers

                conditions: {
                    problem_nickname: '$problem_nickname'
                }
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.problem = data.problem[0];

            getValidatedTestCases(vm.problem, vm.problem.solutions);
            getValidatedTestCases(vm.problem, []);//vm.problem.checkers);

            vm.loading = false;
        });
    }

    vm.deleteSolution = function(solution) {
        return function() {
            solutionService.deleteSolution(vm.contest_nickname, vm.problem_nickname, solution.nickname)
            .then(function(contest) {
                updateProblem();
            });
        };
    };

    vm.deleteChecker = function(checker) {
        return function() {
            checkerService.deleteChecker(vm.contest_nickname, vm.problem_nickname, checker.nickname)
            .then(function(contest) {
                updateProblem();
            });
        };
    };

    vm.deleteTestCase = function(test_case) {
        return function() {
            testCaseService.deleteTestCase(vm.contest_nickname, vm.problem_nickname, test_case.id)
            .then(function(success) {
                updateProblem();
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
                prev.push(cur.id);
                return prev;
            }, [])
        })
        .then(function(results) {
            validationResult = results;

            return graphqlService.get({
                solution: {
                    name:      true,
                    nickname:  true,
                    last_edit: true,

                    runs: {
                        id:        true,
                        number:    true,
                        success:   true,
                        verdict:   true,
                        timestamp: true,

                        test_case: {
                            id: true
                        }
                    },

                    conditions: {
                        solution_nickname: '$solution_nickname'
                    }
                }
            }, {
                solution_nickname: vm.problem.solutions[solution_index].nickname
            }).then(function(data) {
                return data.solution[0];
            });
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

    function getValidatedTestCases(problem, items) {
        items.forEach(function(item) {
            if(item.validatedTestCases !== undefined) {
                return;
            }

            item.validatedTestCases = runService.getValidatedTestCases(problem, item.runs, item);
        });
    }

    vm.downloadFile = function(file) {
        fileService.getSignedDownloadUrl(file.path)
            .then(function(signedUrl) {
                downloadService.download(signedUrl, false, file.name);
            })
            .catch(function(err) {
                vm.err = 'Não foi possível baixar este arquivo.';
            });
    };


    vm.init();
    return vm;
}
})();
