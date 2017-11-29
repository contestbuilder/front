(function() {
'use strict';

angular
  .module('front')
  .directive('breadcrumbs', breadcrumbs);

/** @ngInject */
function breadcrumbs() {
    var directive = {
        restrict        : 'E',
        templateUrl     : 'app/components/breadcrumbs/breadcrumbs.html',
        scope           : {
            new:      '<', // string of what is being added
            edit:     '<', // true or false

            users:    '<', // true or false
            user:     '<',

            contests: '<',
            contest:  '<',
            problem:  '<',
            solution: '<',
            checker:  '<',
            testCase: '<',

            extra:    '<'  // list of extra labels/urls (for those who don't fit a pattern (yet))
        },
        controller      : BreadcrumbsController,
        controllerAs    : 'vm',
        bindToController: true
    };

    return directive;

    /** @ngInject */
    function BreadcrumbsController($filter) {
        var vm = this;

        vm.init = function() {
            vm.items = [];

            // contests list
            if(vm.contests) {
                vm.items.push({
                    label: 'Contests',
                    url:   $filter('url')('contest.list')
                });

                // contest X
                if(vm.contest) {
                    vm.items.push({
                        label: vm.contest.name,
                        url:   $filter('url')('contest.view', vm.contest.nickname)
                    });

                    // problem Y
                    if(vm.problem) {
                        vm.items.push({
                            label: vm.problem.name,
                            url:   $filter('url')('contest.problem.view', vm.contest.nickname, vm.problem.nickname)
                        });

                        // solution Z
                        if(vm.solution) {
                            vm.items.push({
                                label: vm.solution.name,
                                url:   $filter('url')('contest.problem.solution.view', vm.contest.nickname, vm.problem.nickname, vm.solution.nickname)
                            });
                        }

                        // checker Q
                        if(vm.checker) {
                            vm.items.push({
                                label: vm.checker.name,
                                url:   $filter('url')('contest.problem.checker.view', vm.contest.nickname, vm.problem.nickname, vm.checker.nickname)
                            });
                        }

                        // testcase W
                        if(vm.testCase) {
                            var order;
                            if(vm.testCase) {
                                order = vm.testCase.order;
                            } else {
                                order = 1;
                            }

                            vm.items.push({
                                label: '#' + order + ' caso de teste',
                                url:   $filter('url')('contest.problem.testCase.view', vm.contest.nickname, vm.problem.nickname, vm.testCase.id)
                            });
                        }
                    }
                }
            }

            // users list
            if(vm.users) {
                vm.items.push({
                    label: 'Usuários',
                    url:   $filter('url')('user.list')
                });

                // user X
                if(vm.user) {
                    vm.items.push({
                        label: vm.user.username,
                        url:   $filter('url')('user.view')
                    });
                }
            }

            // is an editing page?
            if(vm.edit) {
                vm.items.push({
                    label: 'Editar'
                });
            }

            // is a creating page?
            if(vm.new) {
                vm.items.push({
                    label: 'Nov' + vm.new
                });
            }

            if(vm.extra && vm.extra.length) {
                vm.extra.forEach(function(extra) {
                    vm.items.push({
                        label: extra.label,
                        url:   extra.url
                    });
                });
            }

            // the last item is the selected one
            if(vm.items.length) {
                vm.activeItem = vm.items.pop();
            }
        };

        vm.init();
        return vm;
    }
}

})();
