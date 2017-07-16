(function() {
'use strict';

angular
    .module('front')
    .service('urlService', urlService);

/** @ngInject */
function urlService(frontUrls, utilService) {
    var service = this;

    service.getUrl = function(path, args) {
        var url = utilService.getValueFromObj(frontUrls.urls, path);
        if(!url) {
            return null;
        }

        if(args.length) {
            args.forEach(function(arg) {
                url = url.replace(/:\w*/, arg);
            });
        }

        return url;
    };

    return service;
}

})();
