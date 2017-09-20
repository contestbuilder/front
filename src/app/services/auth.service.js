(function() {
'use strict';

angular
    .module('front')
    .service('authService', authService);

/** @ngInject */
function authService($q, $http, $window, apiUrl) {
    var service = this;

    service.login = function(username, password) {
        return $http.post(apiUrl + 'login', {
        	username: username,
        	password: password
        })
            .then(function(response) {
                var token = response.data.token;

                $window.localStorage.setItem('token', token);
                service.setHeaderToken(token);

                return $q.resolve(response.data);
            });
    };

    service.logout = function() {
        $window.localStorage.removeItem('token');
        service.unsetHeaderToken();
    };

    service.setHeaderToken = function(token) {
        $http.defaults.headers.common['x-access-token'] = token;
    };

    service.unsetHeaderToken = function() {
        delete $http.defaults.headers.common['x-access-token'];
    };

    service.me = function() {
        return $http.get(apiUrl + 'me')
        .then(function(response) {
            return response.data.me;
        });
    };

    service.isLogged = function() {
        return !!$window.localStorage.getItem('token');
    };

    service.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return service;
}

})();
