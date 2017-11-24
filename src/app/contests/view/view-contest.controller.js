(function() {
'use strict';

angular
    .module('front')
    .controller('ViewContestController', ViewContestController);

/** @ngInject */
function ViewContestController($routeParams, authService, downloadService, contestService, contributorService, problemService, graphqlService, routeMe) {
    var vm = this;

    vm.init = function() {
        vm.me      = routeMe;
        vm.contest = {};
        vm.loading = true;

        graphqlService.get({
            contest: {
                name:       true,
                nickname:   true,
                deleted_at: true,
                created_at: true,

                author: {
                    name:     true,
                    username: true
                },

                problems: {
                    name:       true,
                    nickname:   true,
                    deleted_at: true,
                    order:      true
                },

                contributors: {
                    name:     true,
                    username: true
                }
            }
        }, {
            contest_nickname: $routeParams.contest_nickname
        }).then(function(data) {
            vm.contest = data.contest[0];

            updateListOfProblems(vm.contest.problems);
            updateLastBocaZip(vm.contest.bocaZip);

            vm.loading = false;
        });
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
                updateListOfProblems(vm.contest.problems);
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

        // last file edition on the contest

        return vm.latestBocaZip;
    }

    function updateListOfProblems(problems) {
        vm.problemsList = problems.filter(function(problem) {
            return !problem.deleted_at || vm.canI('delete_problem');
        }).sort(function(a, b) {
            return a.order - b.order;
        });
        return vm.problemsList;
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

    vm.getProblemLetter = function(order) {
        return String.fromCharCode(64 + order);
    };

    vm.init();
    return vm;
}
})();
