(function() {
'use strict';

angular
    .module('front')
    .service('contributorService', contributorService);

/** @ngInject */
function contributorService($http, apiUrl) {
    var service = this;

    service.createContributor = function(contest_nickname, user) {
        return $http.post(
            apiUrl + 'contest/' + contest_nickname + '/contributor',
            user
        )
        .then(function(result) {
            return result.data.contest;
        });
    };

    service.deleteContributor = function(contest_nickname, user_id) {
        return $http.delete(
            apiUrl + 'contest/' + contest_nickname + '/contributor/' + user_id
        )
        .then(function(result) {
            return result.data.contest;
        });
    };

    return service;
}

})();
