(function() {
'use strict';

angular
  .module('front')
  .config(routeConfig)
  .controller('AppController', AppController);

/** @ngInject */
function routeConfig(frontUrls, $routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');


    $routeProvider

    /* main */
    .when(frontUrls.urls.main, {
        templateUrl:  'app/main/main.html',
        controller:   'MainController',
        controllerAs: 'vm',
        resolve: {
        }
    })


    /* login */
    .when(frontUrls.urls.login, {
        templateUrl:  'app/login/login.html',
        controller:   'LoginController',
        controllerAs: 'vm'
    })


    /* invitations */
    .when(frontUrls.urls.invitation.regular, {
        templateUrl:  'app/invitations/regular/regular-invitation.html',
        controller:   'RegularInvitationController',
        controllerAs: 'vm',
        resolve: {
        }
    })


    /* logs */
    // .when(frontUrls.urls.log, {
    //     templateUrl : 'app/logs/view-all/view-all-logs.html',
    //     controller  : 'ViewAllLogsController',
    //     controllerAs: 'vm',
    //     resolve     : {
    //         routeMe: getMe
    //     }
    // })


    /* users */
    .when(frontUrls.urls.user.new, {
        templateUrl : 'app/users/create/create-user.html',
        controller  : 'CreateUserController',
        controllerAs: 'vm'
    })
    .when(frontUrls.urls.user.view, {
        templateUrl:  'app/users/view/view-user.html',
        controller:   'ViewUserController',
        controllerAs: 'vm',
        resolve: {
            routeMe: getMe
        }
    })
    .when(frontUrls.urls.user.list, {
        templateUrl:  'app/users/view-all/view-all-users.html',
        controller:   'ViewAllUsersController',
        controllerAs: 'vm',
        resolve: {
            routeMe: getMe
        }
    })


    /* contests */
    .when(frontUrls.urls.contest.new, {
        templateUrl:  'app/contests/create/create-contest.html',
        controller:   'CreateContestController',
        controllerAs: 'vm',
        resolve     : {
            routeMe: getMe
        }
    })
    .when(frontUrls.urls.contest.view, {
        templateUrl:  'app/contests/view/view-contest.html',
        controller:   'ViewContestController',
        controllerAs: 'vm',
        resolve: {
            routeMe: getMe
        }
    })
    .when(frontUrls.urls.contest.list, {
        templateUrl:  'app/contests/view-all/view-all-contests.html',
        controller:   'ViewAllContestsController',
        controllerAs: 'vm',
        resolve: {
            routeMe: getMe
        }
    })


    /* contributors */
    .when(frontUrls.urls.contest.contributor.new, {
        templateUrl:  'app/contributors/create/create-contributor.html',
        controller:   'CreateContributorController',
        controllerAs: 'vm',
        resolve: {
        }
    })


    /* problems */
    .when(frontUrls.urls.contest.problem.new, {
        templateUrl:  'app/problems/create/create-problem.html',
        controller:   'CreateProblemController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.view, {
        templateUrl:  'app/problems/view/view-problem.html',
        controller:   'ViewProblemController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.edit, {
        templateUrl:  'app/problems/edit/edit-problem.html',
        controller:   'EditProblemController',
        controllerAs: 'vm',
        resolve: {
        }
    })


    /* solutions */
    .when(frontUrls.urls.contest.problem.solution.new, {
        templateUrl:  'app/solutions/create/create-solution.html',
        controller:   'CreateSolutionController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.solution.view, {
        templateUrl:  'app/solutions/view/view-solution.html',
        controller:   'ViewSolutionController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.solution.edit, {
        templateUrl:  'app/solutions/edit/edit-solution.html',
        controller:   'EditSolutionController',
        controllerAs: 'vm',
        resolve: {
        }
    })


    /* checkers */
    .when(frontUrls.urls.contest.problem.checker.new, {
        templateUrl : 'app/checkers/create/create-checker.html',
        controller  : 'CreateCheckerController',
        controllerAs: 'vm',
        resolve     : {
        }
    })
    .when(frontUrls.urls.contest.problem.checker.view, {
        templateUrl : 'app/checkers/view/view-checker.html',
        controller  : 'ViewCheckerController',
        controllerAs: 'vm',
        resolve     : {
        }
    })
    .when(frontUrls.urls.contest.problem.checker.edit, {
        templateUrl : 'app/checkers/edit/edit-checker.html',
        controller  : 'EditCheckerController',
        controllerAs: 'vm',
        resolve     : {
        }
    })


    /* test cases */
    .when(frontUrls.urls.contest.problem.testCase.new, {
        templateUrl:  'app/testCases/create/create-testCase.html',
        controller:   'CreateTestCaseController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.testCase.view, {
        templateUrl:  'app/testCases/view/view-testCase.html',
        controller:   'ViewTestCaseController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.testCase.edit, {
        templateUrl:  'app/testCases/edit/edit-testCase.html',
        controller:   'EditTestCaseController',
        controllerAs: 'vm',
        resolve: {
        }
    })


    /* solution runs */
    .when(frontUrls.urls.contest.problem.solution.run.list, {
        templateUrl:  'app/solutions/runs/list/solution-runs.html',
        controller:   'ViewSolutionRunsController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.solution.run.view, {
        templateUrl:  'app/solutions/runs/view/solution-run.html',
        controller:   'ViewSolutionRunController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.solutionRun.list, {
        templateUrl:  'app/solutionsRuns/list/solutionRuns-list.html',
        controller:   'ViewProblemSolutionRunsController',
        controllerAs: 'vm',
        resolve: {
        }
    })
    .when(frontUrls.urls.contest.problem.solutionRun.view, {
        templateUrl:  'app/solutionsRuns/view/view-solutionRun.html',
        controller:   'ViewProblemSolutionRunController',
        controllerAs: 'vm',
        resolve: {
        }
    })


    /* checker runs */
    // .when(frontUrls.urls.contest.problem.checker.run.list, {
    //     templateUrl : 'app/checkers/runs/list/checker-runs.html',
    //     controller  : 'ViewCheckerRunsController',
    //     controllerAs: 'vm',
    //     resolve     : {
    //         routeContest: getContest,
    //         routeProblem: getProblem,
    //         routeChecker: getChecker
    //     }
    // })
    // .when(frontUrls.urls.contest.problem.checker.run.view, {
    //     templateUrl : 'app/checkers/runs/view/checker-run.html',
    //     controller  : 'ViewCheckerRunController',
    //     controllerAs: 'vm',
    //     resolve     : {
    //         routeContest: getContest,
    //         routeProblem: getProblem,
    //         routeChecker: getChecker
    //     }
    // })
    // .when(frontUrls.urls.contest.problem.checkerRun.list, {
    //     templateUrl : 'app/checkersRuns/list/checkerRuns-list.html',
    //     controller  : 'ViewProblemCheckerRunsController',
    //     controllerAs: 'vm',
    //     resolve     : {
    //         routeContest: getContest,
    //         routeProblem: getProblem
    //     }
    // })
    // .when(frontUrls.urls.contest.problem.checkerRun.view, {
    //     templateUrl : 'app/checkersRuns/view/view-checkerRun.html',
    //     controller  : 'ViewProblemCheckerRunController',
    //     controllerAs: 'vm',
    //     resolve     : {
    //         routeContest: getContest,
    //         routeProblem: getProblem
    //     }
    // })


    .otherwise({
        redirectTo: '/'
    });


    $locationProvider.html5Mode(true);
}

/** @ngInject */
function AppController($rootScope, $location, $filter) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
        if(rejection && rejection.data && rejection.data.error) {
            switch(rejection.data.error) {
                case 'Access denied':
                    $location.search('message', 'access_denied');
                    $location.path($filter('url')('login'));
                    break;
                
                case 'TokenExpiredError: jwt expired':
                    $location.search('message', 'token_expired');
                    $location.path($filter('url')('login'));
                    return;

                default:
                    $location.path($filter('url')('login'));
                    return;
            }
        }

        $location.path($filter('url')('login'));
    });
}

function getMe(authService) {
    return authService.me();
}

function getUser($route, frontUrls, userService) {
    return userService.getUser(
        $route.current.params[frontUrls.paramKeys.user]
    );
}

function getUserById($route, frontUrls, userService) {
    return userService.getUserById(
        $route.current.params[frontUrls.paramKeys.user_id]
    );
}

function getContest($route, frontUrls, contestService) {
    return contestService.getContest(
        $route.current.params[frontUrls.paramKeys.contest]
    );
}

function getProblem($route, frontUrls, problemService) {
    return problemService.getProblem(
        $route.current.params[frontUrls.paramKeys.contest],
        $route.current.params[frontUrls.paramKeys.problem]
    );
}

function getSolution($route, frontUrls, solutionService) {
    return solutionService.getSolution(
        $route.current.params[frontUrls.paramKeys.contest],
        $route.current.params[frontUrls.paramKeys.problem],
        $route.current.params[frontUrls.paramKeys.solution]
    );
}

function getChecker($route, frontUrls, checkerService) {
    return checkerService.getChecker(
        $route.current.params[frontUrls.paramKeys.contest],
        $route.current.params[frontUrls.paramKeys.problem],
        $route.current.params[frontUrls.paramKeys.checker]
    );
}

function getTestCase($route, frontUrls, testCaseService) {
    return testCaseService.getTestCase(
        $route.current.params[frontUrls.paramKeys.contest],
        $route.current.params[frontUrls.paramKeys.problem],
        $route.current.params[frontUrls.paramKeys.testCase]
    );
}

})();
