(function() {
'use strict';

angular
    .module('front')
    .service('graphqlService', graphqlService);

/** @ngInject */
function graphqlService($http, apiUrl) {
    var service = this;

    service.get = function(obj, variables) {
        return $http.post(apiUrl + 'graphql', service.buildQuery(obj, variables))
        .then(function(result) {
            return result.data.data;
        });
    };

    service.buildQuery = function(obj, variables) {
        return {
            query:     recursivelyBuildQuery(obj),
            variables: variables || {}
        };
    };

    function recursivelyBuildQuery(obj) {
        var children = [];

        Object.keys(obj).forEach(function(key) {
            var child = obj[key];

            if(typeof child === 'boolean' && child) {
                children.push(key);
            } else if(typeof child === 'object') {
                children.push(key + ' ' + recursivelyBuildQuery(child));
            }
        });

        return '{ ' + children.join(', ') + ' }';
    }

    return service;
}

})();
