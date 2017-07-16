(function() {
'use strict';

angular
    .module('front')
    .controller('MainController', MainController);

/** @ngInject */
function MainController() {
    var vm = this;

    vm.init = function() {
    };

    vm.init();
    return vm;
}
})();
