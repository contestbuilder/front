(function() {
'use strict';

angular
    .module('front')
    .service('fileService', fileService);

/** @ngInject */
function fileService($http, apiUrl) {
    var service = this;

    service.getSignedUploadUrl = function(fileName) {
        return $http.post(
            apiUrl + 'file',
            {
                name: fileName
            }
        )
        .then(function(result) {
            return result.data.signedUrl;
        });
    };

    service.getSignedDownloadUrl = function(filePath) {
        return $http.post(
            apiUrl + 'file/download',
            {
                path: filePath
            }
        )
        .then(function(result) {
            return result.data.signedUrl;
        });
    };

    return service;
}

})();