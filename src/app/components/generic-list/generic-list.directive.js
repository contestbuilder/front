(function() {
'use strict';

angular
  .module('front')
  .directive('genericList', genericList);

/** @ngInject */
function genericList($compile) {
    var directive = {
        restrict        : 'E',
        templateUrl     : 'app/components/generic-list/generic-list.html',
        transclude      : true,
        controller      : GenericListController,
        controllerAs    : 'list',
        scope: {
            items:          '<', // list
            noItemsMessage: '<', // string
            headers:        '<', // list
            parent:         '<'  // controller
        },
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function GenericListController() {
        var list = this;

        list.init = function() {
        };

        list.init();
        return list;
    }
}

})();
