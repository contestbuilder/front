(function() {
'use strict';

angular
    .module('front')
    .controller('LoginController', LoginController);

/** @ngInject */
function LoginController($route, $filter, $location, authService) {
    var vm = this;

    vm.init = function() {
    	if(authService.isLogged()) {
    		$location.path($filter('url', 'main'));
    	}

        var queryMessage = $location.search().message;
        if(queryMessage) {
            switch(queryMessage) {
                case 'access_denied':
                    vm.errorMessage = 'Acesso negado.';
                    break;

                case 'token_expired':
                    vm.errorMessage = 'Acesso expirado. Refaça seu login.';
                    break;
            }
        }
    };

    vm.submit = function() {
    	authService.login(vm.form.username, vm.form.password)
    	.then(function(data) {
    		$route.reload();
    	})
    	.catch(function(err) {
    		console.log(err);
    	});
    };

    vm.init();
}
})();
