(function() {
'use strict';

angular
    .module('front')
    .controller('ViewAllContestsController', ViewAllContestsController);

/** @ngInject */
function ViewAllContestsController(graphqlService, routeMe) {
    var vm = this;

    vm.init = function() {
        vm.me = routeMe;
        vm.contestList = [];

        graphqlService.get({
            contest: {
                name:     true,
                nickname: true,
                author: {
                    username: true
                },
                created_at: true
            }
        }).then(function(data) {
            vm.contestList = data.contest;
        });
    };

    vm.init();
    return vm;
}
})();
