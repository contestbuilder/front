(function() {
'use strict';

angular
    .module('front')
    .service('runService', runService);

/** @ngInject */
function runService($http, apiUrl) {
    var service = this;

    service.runSolutions = function(contest_nickname, problem_nickname, data) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/run/solutions', 
            data
        )
        .then(function(result) {
            return result.data.results;
        });
    };

    service.runCheckers = function(contest_nickname, problem_nickname, data) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/run/checkers', 
            data
        )
        .then(function(result) {
            return result.data.results;
        });
    };

    service.getValidatedTestCases = function(problem, runs, versions) {
        var test_cases = angular.copy(problem.test_cases);
        var runs = angular.copy(runs).reverse();

        runs.forEach(function(run) {
            if(hasCriticalAfter(versions, run.timestamp)) {
                return;
            }

            for(var i=0; i<test_cases.length; i++) {
                if(test_cases[i]._id == run.test_case_id) {
                    if(!hasCriticalAfter(test_cases[i].v, run.timestamp)
                    && run.verdict == 'Accepted') {
                        test_cases.splice(i, 1);
                    }
                    break;
                }
            }
        });

        return problem.test_cases.length - test_cases.length;
    };

    function hasCriticalAfter(versions, timestamp) {
        return versions.some(function(version) {
            return version.critical && moment(version.timestamp).isAfter(timestamp);
        });
    }

    return service;
}

})();