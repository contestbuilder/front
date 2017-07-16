(function() {
'use strict';

angular
	.module('front')
	.run(setToken);

/** @ngInject */
function setToken($http, $window, authService) {
    var token = $window.localStorage.getItem('token');

    if(token) {
    	authService.setHeaderToken(token);
    }
}

})();
