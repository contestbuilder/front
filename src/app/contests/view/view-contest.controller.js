(function() {
'use strict';

angular
    .module('front')
    .controller('ViewContestController', ViewContestController);

/** @ngInject */
function ViewContestController(authService, downloadService, contestService, contributorService, problemService, routeMe, routeContest) {
    var vm = this;

    vm.init = function() {
        vm.me      = routeMe;
        vm.contest = routeContest;

        updateLastBocaZip(vm.contest.bocaZip);
    };

    vm.canI = function(action, obj) {
        switch(action) {
            case 'delete_contributor':
                return vm.contest.author._id == vm.me._id;
            case 'delete_problem':
                return vm.contest.author._id == vm.me._id;
            default:
                return false;
        }
    };

    vm.deleteContributor = function(contributor) {
        return function() {
            contributorService.deleteContributor(vm.contest.nickname, contributor._id)
            .then(function(contest) {
                vm.contest = contest;
            });
        };
    };

    vm.deleteProblem = function(problem) {
        return function() {
            problemService.deleteProblem(vm.contest.nickname, problem.nickname)
            .then(function(contest) {
                vm.contest = contest;
            });
        };
    };

    vm.deleteContest = function() {
        return function() {
            contestService.deleteContest(vm.contest.nickname)
            .then(function(contest) {
                vm.contest = contest;
            });
        };
    };

    function updateLastBocaZip(bocaZipList) {
        if(!Array.isArray(bocaZipList) || !bocaZipList.length) {
            return vm.latestBocaZip = null;
        }

        vm.latestBocaZip = bocaZipList[ bocaZipList.length-1 ];
        vm.latestBocaZip.downloadUrl = 'http://localhost:3010/api/v1' +
            '/contest/' + vm.contest.nickname + 
            '/boca/download' +
            '?VersionId=' + vm.latestBocaZip.VersionId + 
            '&token=' + authService.getToken();

        return vm.latestBocaZip;
    }

    vm.generateZip = function() {
        var problemNicknames = vm.contest.problems.map(function(problem) {
            return problem.nickname;
        });

        contestService.generateBocaZip(vm.contest.nickname, {
            problems: problemNicknames
        })
            .then(function(bocaZip) {
                vm.contest.bocaZip.push(bocaZip);
                updateLastBocaZip(vm.contest.bocaZip);
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    vm.downloadZip = function(versionId) {
        contestService.downloadBocaZip(vm.contest.nickname, versionId)
            .then(function(signedUrl) {
                downloadService.download(signedUrl);
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    vm.init();
    return vm;
}
})();
