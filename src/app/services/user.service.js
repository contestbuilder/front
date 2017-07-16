(function() {
'use strict';

angular
    .module('front')
    .service('userService', userService);

/** @ngInject */
function userService($http, apiUrl) {
    var service = this;

    service.getUsers = function(show_deleted) {
        return $http.get(apiUrl + 'user' + (show_deleted ? '?deleted=true' : ''))
        .then(function(result) {
        	return result.data.users;
        });
    };

    service.getUser = function(username) {
        return $http.get(apiUrl + 'user/' + username)
        .then(function(result) {
            return result.data.user;
        });
    };

    service.createUser = function(user) {
        return $http.post(apiUrl + 'user', user)
        .then(function(result) {
            return result.data.user;
        });
    };

    service.deleteUser = function(username) {
        return $http.delete(apiUrl + 'user/' + username)
        .then(function(result) {
            return result.data.user;
        });
    }

    return service;
}

})();
