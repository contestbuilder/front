(function() {
'use strict';

angular
  .module('front')
  .directive('navbar', navbar);

/** @ngInject */
function navbar() {
    var directive = {
        restrict        : 'E',
        templateUrl     : 'app/components/navbar/navbar.html',
        scope           : {},
        controller      : NavbarController,
        controllerAs    : 'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($route, $location, $scope, $filter, authService) {
        var vm = this;

        vm.init = function() {
            vm.isLogged = authService.isLogged();

            vm.mainLinks = getMainLinks();
        };

        function getMainLinks() {
            var links = [{
                label:   'Home',
                urlPath: 'main' 
            }, {
                label:   'Contests',
                urlPath: 'contest.list'
            }, {
                label:   'Usuários',
                urlPath: 'user.list'
            }, {
                label:   'Histórico',
                urlPath: 'log'
            }];

            links.forEach(function(link) {
                link.active = $location.path() == $filter('url')(link.urlPath);
            });

            return links;
        }

        vm.logout = function() {
            authService.logout();
            $location.path('/');
        };

        vm.init();
        return vm;
    }
}

})();
