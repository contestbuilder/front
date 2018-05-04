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
        var parsedVariables = '';
        if(typeof variables === 'object' && Object.keys(variables).length) {
            parsedVariables = '(' + Object.keys(variables).map(function(variableKey) {
                return '$' + variableKey + ': ' + translateType(typeof variables[variableKey]);
            }).join(', ') + ')';
        }

        return {
            query:     'query ' + parsedVariables + ' ' + recursivelyBuildQuery(obj),
            variables: variables || {}
        };
    };

    function recursivelyBuildQuery(obj) {
        var children = [];

        Object.keys(obj).forEach(function(key) {
            if(key === 'conditions') {
                return;
            }

            var child = obj[key];

            if(typeof child === 'boolean' && child) {
                children.push(key);
            } else if(typeof child === 'object') {
                children.push(key + ' ' + recursivelyBuildQuery(child));
            }
        });

        var parsedVariables = '';
        if(typeof obj.conditions === 'object' && Object.keys(obj.conditions).length) {
            parsedVariables = '(' + Object.keys(obj.conditions).map(function(variableKey) {
                return variableKey + ': ' + obj.conditions[variableKey];
            }).join(', ') + ')';
        }

        return parsedVariables + ' { ' + children.join(', ') + ' }';
    }

    function translateType(type) {
        switch(type) {
            case 'number':  return 'Int';
            case 'string':  return 'String';
            case 'boolean': return 'Boolean';
            default:        return 'String';
        }
    }

    return service;
}

})();
