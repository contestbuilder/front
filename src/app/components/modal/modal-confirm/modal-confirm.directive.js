(function() {
'use strict';

angular
  .module('front')
  .directive('modalConfirm', modalConfirm);

/** @ngInject */
function modalConfirm($uibModal, $document) {
    var directive = {
        restrict        : 'A',
        scope           : {
            callback: '&modalConfirm',
            title:    '<modalConfirmTitle',
            body:     '<modalConfirmBody'
        },
        link            : ModalConfirmLink
    };

    return directive;

    /** @ngInject */
    function ModalConfirmLink(scope, el, attr, ctrl) {
        var callback = scope.callback();

        el.bind('click', function() {
            var modalInstance = $uibModal.open({
                animation:        false,
                templateUrl:      'app/components/modal/modal-confirm/modal-confirm.html',
                controller:       ModalConfirmController,
                controllerAs:     '$ctrl',
                scope:            scope,
                bindToController: true
            });

            modalInstance.result.then(function(result) {
                callback();
            }, function() {
            });
        });
    }

    /** @ngInject */
    function ModalConfirmController($scope, $uibModalInstance) {
        var vm = this;

        vm.ok = function() {
            $uibModalInstance.close();
        };

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
}

})();
