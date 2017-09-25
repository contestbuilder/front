(function() {
'use strict';

angular
  .module('front')
  .directive('singleAttachment', singleAttachment);

/** @ngInject */
function singleAttachment() {
    var directive = {
        restrict        : 'E',
        templateUrl     : 'app/components/single-attachment/single-attachment.html',
        scope           : {
            // the file object (must have a name property).
            file: '<',

            // text to show on 'attach' button.
            customAttachText: '<',

            // callbacks
            signedDownloadCallback: '&',
            signedUploadCallback:   '&',
            afterUploadCallback:    '&',
            removeCallback:         '&'
        },
        controller      : SingleAttachmentController,
        controllerAs    : 'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function SingleAttachmentController(downloadService, Upload) {
        var vm = this;

        vm.init = function() {
            vm.loading = false;
        };

        vm.downloadFile = function() {
            vm.loading = true;

            vm.signedDownloadCallback()
                .then(function(signedUrl) {
                    vm.loading = false;

                    downloadService.download(signedUrl, false, vm.file.name);
                })
                .catch(function(err) {
                    vm.loading = false;

                    vm.err = 'Não foi possível baixar este arquivo.';
                });
        };

        vm.removeFile = function() {
            vm.loading = true;

            vm.removeCallback()
                .then(function(response) {
                    vm.loading = false;

                    vm.file = undefined;
                })
                .catch(function(err) {
                    vm.loading = false;

                    vm.err = 'Não foi possível excluir este arquivo.';
                });
        };

        vm.uploadFile = function(file, errFiles) {
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
            var fileName = file.name;

            vm.loading = true;
            vm.signedUploadCallback({ file: file })
                .then(function(signedUrl) {
                    return new Promise(function(resolve, reject) {
                        Upload.upload({
                            url:    signedUrl.url,
                            method: 'POST',
                            data:   {
                                key:                signedUrl.key,
                                Policy:             signedUrl.fields.Policy,
                                'X-Amz-Algorithm':  signedUrl.fields['X-Amz-Algorithm'],
                                'X-Amz-Credential': signedUrl.fields['X-Amz-Credential'],
                                'X-Amz-Date':       signedUrl.fields['X-Amz-Date'],
                                'X-Amz-Signature':  signedUrl.fields['X-Amz-Signature'],
                                file:               file
                            },
                            headers: {
                                'x-access-token': undefined
                            }
                        })
                        .then(function finishCallback(response) {
                            return resolve(response.data);
                        }, function errCallback(err) {
                            return reject(err);
                        }, function progressCallback(evt) {
                            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        });
                    });
                })
                .then(function(result) {
                    return vm.afterUploadCallback({ file: file });
                })
                .then(function(response) {
                    vm.loading = false;

                    vm.file = {
                        name: fileName
                    };
                })
                .catch(function(err) {
                    vm.loading = false;

                    vm.err = 'Não foi possível fazer upload deste arquivo.';
                });
        };

        vm.init();
        return vm;
    }
}

})();
