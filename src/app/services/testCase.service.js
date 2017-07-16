(function() {
'use strict';

angular
    .module('front')
    .service('testCaseService', testCaseService);

/** @ngInject */
function testCaseService($http, apiUrl) {
    var service = this;

    service.getTestCase = function(contest_nickname, problem_nickname, test_case_id) {
        return $http.get(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/' + test_case_id
        )
        .then(function(result) {
            return result.data.test_case;
        });
    };

    service.createTestCase = function(contest_nickname, problem_nickname, test_case) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case', 
            test_case
        )
        .then(function(result) {
            return result.data.test_case;
        });
    };

    service.editTestCase = function(contest_nickname, problem_nickname, test_case_id, test_case) {
        return $http.put(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/' + test_case_id,
            test_case
        )
        .then(function(result) {
            return result.data.test_case;
        });
    };

    service.deleteTestCase = function(contest_nickname, problem_nickname, test_case_id) {
        return $http.delete(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/' + test_case_id
        )
        .then(function(result) {
            return result.data.contest;
        });
    };

    return service;
}

})();
