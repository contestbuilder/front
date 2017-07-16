(function() {
'use strict';

angular
  .module('front')
  .directive('alertInactive', alertInactive);

/** @ngInject */
function alertInactive() {
    var directive = {
        restrict        : 'E',
        templateUrl     : 'app/components/alert-inactive/alert-inactive.html',
        scope           : {
            msg: '<'
        },
        controller      : AlertInactiveController,
        controllerAs    : 'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function AlertInactiveController() {
        var vm = this;

        vm.init = function() {
        };

        vm.init();
        return vm;
    }
}

})();
