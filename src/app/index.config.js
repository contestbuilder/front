(function() {
'use strict';

angular
    .module('front')
    .config(removeNgTransclude);

/** @ngInject */
function removeNgTransclude($provide) {
    $provide.decorator('ngTranscludeDirective', ['$delegate', function ($delegate) {
        $delegate.shift();
        return $delegate;
    }]);
}

})();
