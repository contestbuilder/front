(function() {
'use strict';

angular
    .module('front')
    .controller('CreateContributorController', CreateContributorController);

/** @ngInject */
function CreateContributorController($location, $filter, userService, contributorService, routeContest) {
    var vm = this;

    vm.init = function() {
    	vm.contest = routeContest;
    	vm.usersList = [];

    	userService.getUsers()
    	.then(function(users) {
    		vm.usersList = users.filter(function(user) {
    			return !vm.contest.contributors.some(function(contributor) {
    				return contributor.username === user.username;
    			});
    		});
    	});
    };

    vm.submit = function() {
        contributorService.createContributor(vm.contest.nickname, {
            user_id: vm.form.user._id
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
