(function() {
'use strict';

angular
    .module('front')
    .controller('ViewAllLogsController', ViewAllLogsController);

/** @ngInject */
function ViewAllLogsController(logService, routeMe) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.logsList = [];

        logService.getLogs()
        .then(function(logs) {
            vm.logsList = logs;
        });
    };

    vm.init();
    return vm;
}
})();
