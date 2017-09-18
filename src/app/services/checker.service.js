(function() {
'use strict';

angular
    .module('front')
    .service('checkerService', checkerService);

/** @ngInject */
function checkerService($http, apiUrl) {
    var service = this;

    service.getChecker = function(contest_nickname, problem_nickname, checker_nickname) {
        return $http.get(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/checker/' + checker_nickname
        )
        .then(function(result) {
            return result.data.checker;
        });
    };

    service.createChecker = function(contest_nickname, problem_nickname, checker) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/checker', 
            checker
        )
        .then(function(result) {
            return result.data.checker;
        });
    };

    service.editChecker = function(contest_nickname, problem_nickname, checker_nickname, checker) {
        return $http.put(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/checker/' + checker_nickname,
            checker
        )
        .then(function(result) {
            return result.data.checker;
        });
    };

    service.deleteChecker = function(contest_nickname, problem_nickname, checker_nickname) {
        return $http.delete(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/checker/' + checker_nickname
        )
        .then(function(result) {
            return result.data.contest;
        });
    };

    return service;
}

})();
