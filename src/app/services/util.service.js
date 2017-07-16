(function() {
'use strict';

angular
    .module('front')
    .service('utilService', utilService);

/** @ngInject */
function utilService(languages, verdicts) {
    var service = this;

    service.getLanguage = function(languageValue) {
        return languages.filter(function(l) {
            return l.value == languageValue;
        })[0] || languages[0];
    };

    service.getVerdict = function(verdictValue) {
        return verdicts.filter(function(v) {
            return v.value == verdictValue;
        })[0] || verdicts[0];
    };

    service.getValueFromObj = function(obj, path) {
    	var dotIndex = path.indexOf('.');
    	
    	if(dotIndex !== -1) {
    		var prefix = path.substr(0, dotIndex);
    		var suffix = path.substr(dotIndex+1);

    		if(typeof obj[prefix] !== 'object') {
    			return null;
    		}

    		return service.getValueFromObj(obj[prefix], suffix);
    	} else {
    		return obj[path];
    	}
    };

    return service;
}

})();
