(function() {
'use strict';

angular
    .module('front')
    .controller('CreateContributorController', CreateContributorController);

/** @ngInject */
function CreateContributorController($location, userService, contributorService, routeContest) {
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
            $location.path('/contests/' + vm.contest.nickname);
        });
    };

    vm.init();
    return vm;
}
})();
