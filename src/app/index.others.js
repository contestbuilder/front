(function() {
'use strict';

angular
	.module('front')
	.directive('ngTransclude', customNgTransclude);

/** @ngInject */
function customNgTransclude() {
    return {
        restrict: 'EAC',
        link: function($scope, $element, $attrs, controller, $transclude) {
            if(!$transclude) {
                throw minErr('ngTransclude')(
					'orphan',
					'Illegal use of ngTransclude directive in the template! ' +
					'No parent directive that requires a transclusion found. ' +
					'Element: {0}',
					startingTag($element)
				);
            }

            var iScopeType = $attrs['ngTransclude'] || 'sibling';

            switch(iScopeType) {
                case 'sibling':
                    $transclude(function(clone) {
                        $element.append(clone);
                    });
                    break;

                case 'parent':
                    $transclude($scope, function(clone) {
                        if(clone.length) {
                            $element.append(clone);
                        }
                    });
                    break;

                case 'child':
                    var iChildScope = $scope.$new();
                    $transclude(iChildScope, function(clone) {
                        $element.append(clone);
                        $element.on('$destroy', function() {
                            iChildScope.$destroy();
                        });
                    });
                    break;
            }
        }
    }
}

})();
