(function() {
'use strict';

angular
    .module('front')
    .service('logService', logService);

/** @ngInject */
function logService($http, apiUrl) {
    var service = this;

    service.getLogs = function() {
        return $http.get(apiUrl + 'log')
        .then(function(result) {
            return result.data.logs;
        });
    };

    return service;
}

})();
