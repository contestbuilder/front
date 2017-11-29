(function() {
'use strict';

angular
    .module('front')
    .controller('MainController', MainController);

/** @ngInject */
function MainController(authService) {
    var vm = this;

    vm.init = function() {
    	vm.logged = authService.isLogged();
    };

    vm.init();
    return vm;
}
})();
