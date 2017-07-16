(function() {
'use strict';

angular
    .module('front')
    .service('contestService', contestService);

/** @ngInject */
function contestService($http, apiUrl) {
    var service = this;

    service.getContests = function(show_deleted) {
        return $http.get(apiUrl + 'contest' + (show_deleted ? '?deleted=true' : ''))
        .then(function(result) {
        	return result.data.contests;
        });
    };

    service.getContest = function(nickname) {
        return $http.get(apiUrl + 'contest/' + nickname)
        .then(function(result) {
            return result.data.contest;
        });
    };

    service.createContest = function(contest) {
        return $http.post(apiUrl + 'contest', contest)
        .then(function(result) {
            return result.data.contest;
        });
    };

    service.deleteContest = function(nickname) {
        return $http.delete(apiUrl + 'contest/' + nickname)
        .then(function(result) {
            return result.data.contest;
        });
    };

    return service;
}

})();