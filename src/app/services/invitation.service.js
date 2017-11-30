(function() {
'use strict';

angular
    .module('front')
    .service('invitationService', invitationService);

/** @ngInject */
function invitationService($http, apiUrl) {
    var service = this;

    service.getUser = function(user_id) {
        return $http.get(apiUrl + 'invitation/user/' + user_id)
        .then(function(result) {
            return result.data.user;
        });
    };

    service.editUser = function(user_id, data) {
        return $http.put(apiUrl + 'invitation/user/' + user_id, data)
        .then(function(result) {
            return result.data.user;
        });
    };

    return service;
}

})();
