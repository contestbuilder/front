(function() {
'use strict';

angular
    .module('front')
    .service('testCaseService', testCaseService);

/** @ngInject */
function testCaseService($http, apiUrl) {
    var service = this;

    service.getTestCase = function(contest_nickname, problem_nickname, test_case_id, query) {
        return $http.get(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/' + test_case_id,
            {
                params: query
            }
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
            return result.data.success;
        });
    };


    service.getDownloadFileSignedUrl = function(contest_nickname, problem_nickname, file_name) {
        return $http.get(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/file/' + file_name
        )
        .then(function(result) {
            return result.data.signedUrl;
        });
    };

    service.getUploadFileSignedUrl = function(contest_nickname, problem_nickname, data) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/file',
            data
        )
        .then(function(result) {
            return result.data.signedUrl;
        });
    };

    service.deleteFile = function(contest_nickname, problem_nickname, file_name) {
        return $http.delete(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/file/' + file_name
        )
        .then(function(result) {
            return result.data.success;
        });
    };

    service.registerFile = function(contest_nickname, problem_nickname, file_name) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/problem/' + problem_nickname + '/test_case/file/' + file_name
        )
        .then(function(result) {
            return result.data.file_id;
        });
    };

    return service;
}

})();
