(function() {
'use strict';

angular
    .module('front')
    .service('problemService', problemService);

/** @ngInject */
function problemService($http, apiUrl) {
    var service = this;

    service.getProblem = function(contest_nickname, problem_nickname) {
        return $http.get(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname
        )
        .then(function(result) {
            return result.data.problem;
        });
    };

    service.createProblem = function(contest_nickname, problem) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem', 
            problem
        )
        .then(function(result) {
            return result.data.problem;
        });
    };

    service.editProblem = function(contest_nickname, problem_nickname, problem) {
        return $http.put(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname,
            problem
        )
        .then(function(result) {
            return result.data.problem;
        });
    };

    service.deleteProblem = function(contest_nickname, problem_nickname) {
        return $http.delete(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname
        )
        .then(function(result) {
            return result.data.contest;
        });
    };

    return service;
}

})();
