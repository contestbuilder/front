(function() {
'use strict';

angular
    .module('front')
    .service('solutionService', solutionService);

/** @ngInject */
function solutionService($http, apiUrl) {
    var service = this;

    service.getSolution = function(contest_nickname, problem_nickname, solution_nickname) {
        return $http.get(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/solution/' + solution_nickname
        )
        .then(function(result) {
            return result.data.solution;
        });
    };

    service.createSolution = function(contest_nickname, problem_nickname, solution) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/solution', 
            solution
        )
        .then(function(result) {
            return result.data.solution;
        });
    };

    service.editSolution = function(contest_nickname, problem_nickname, solution_nickname, solution) {
        return $http.put(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/solution/' + solution_nickname,
            solution
        )
        .then(function(result) {
            return result.data.solution;
        });
    };

    service.deleteSolution = function(contest_nickname, problem_nickname, solution_nickname) {
        return $http.delete(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/solution/' + solution_nickname
        )
        .then(function(result) {
            return result.data.contest;
        });
    };

    return service;
}

})();
