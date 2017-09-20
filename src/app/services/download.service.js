(function() {
'use strict';

angular
    .module('front')
    .service('downloadService', downloadService);

/** @ngInject */
function downloadService($document) {
    var service = this;

    service.download = function(url, popupWindow) {
		var body = $document.find('body').eq(0);
		var link = angular.element(
			'<a ' +
			'id="temp_link" ' +
			'download ' +
			'href="' + url + '" ' +
			'style="display: none;" ' +
			(popupWindow ? 'target="_blank" ' : '') +
			'>link</a>'
		);
		body.append(link);
		link[0].click();
		link.remove();
	};

    return service;
}

})();