(function() {
'use strict';

angular
  .module('front')
  .directive('fileLoader', fileLoader);

/** @ngInject */
function fileLoader() {
    var directive = {
        restrict:    'E',
        templateUrl: 'app/components/file-loader/file-loader.html',
        scope: {
            // the file object (must have a name property).
            file: '<',

            // text to show on 'attach' button.
            customAttachText: '<',

            // callbacks
            loadCallback:   '&',
            removeCallback: '&'
        },
        controller:       FileLoader,
        controllerAs:     'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function FileLoader($scope) {
        var vm = this;

        vm.init = function() {
            vm.loading = false;
        };

        vm.removeFile = function() {
            vm.file = undefined;

            vm.removeCallback();
        };

        vm.loadFile = function(file, errFiles) {
            if(errFiles && errFiles[0]) {
                errFiles = errFiles[0];

                if(errFiles.$errorMessages && errFiles.$errorMessages.maxSize) {
                    return vm.err = 'O arquivo selecionado ultrapassa o limite de 4MB.';
                }

                return vm.err = 'Erro desconhecido.';
            }

            if(!file) {
                return;
            }
            vm.file = file;

            var fileReader = new FileReader();
            fileReader.onload = function(evt) {
                $scope.$apply(function() {
                    vm.loadCallback({
                        err:     null,
                        file:    vm.file,
                        content: fileReader.result
                    });
                });
            };
            fileReader.onerror = function(evt) {
                $scope.$apply(function() {
                    vm.err = 'Error on loading file.';

                    vm.loadCallback({
                        err: vm.err
                    });
                });
            };
            fileReader.readAsText(vm.file);
        };

        vm.init();
        return vm;
    }
}

})();
