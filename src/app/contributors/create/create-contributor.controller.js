(function() {
'use strict';

angular
    .module('front')
    .controller('CreateContributorController', CreateContributorController);

/** @ngInject */
function CreateContributorController($routeParams, $location, $filter, contributorService, graphqlService) {
    var vm = this;

    vm.init = function() {
    	vm.contest = {};
        vm.usersList = [];
        vm.loading = true;

        graphqlService.get({
            contest: {
                name:         true,
                nickname:     true,

                contributors: {
                    name:     true,
                    username: true
                },

                conditions: {
                    contest_nickname: '$contest_nickname'
                }
            },

            user: {
                id:       true,
                name:     true,
                username: true
            }
        }, {
            contest_nickname: $routeParams.contest_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];
            vm.usersList = data.user.filter(function(user) {
                return !vm.contest.contributors.some(function(contributor) {
                    return contributor.username === user.username;
                });
            });

            vm.loading = false;
        });
    };

    vm.submit = function() {
        contributorService.createContributor(vm.contest.nickname, {
            user_id: vm.form.user.id
        })
        .then(function(contest) {
            $location.path($filter('url')(
                'contest.view',
                vm.contest.nickname
            ));
        });
    };

    vm.init();
    return vm;
}
})();
