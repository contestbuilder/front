(function() {
'use strict';

angular
    .module('front')
    .service('authInterceptor', authInterceptor);

/** @ngInject */
function authInterceptor($q, $location, $injector) {
    var interceptor = this;

    interceptor.responseError = function(response) {
        if(response.status == 500 && response.data.error == "TokenExpiredError: jwt expired") {
            $injector.get('authService').logout();
            return $q.reject(response);
        } else {
            return $q.reject(response);
        }
    };

    return interceptor;
}

})();
