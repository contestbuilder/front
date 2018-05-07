(function() {
'use strict';

angular
    .module('front')
    .controller('ViewTestCaseController', ViewTestCaseController);

/** @ngInject */
function ViewTestCaseController($routeParams, testCaseService, graphqlService) {
    var vm = this;

    vm.init = function() {
        vm.contest   = {};
        vm.problem   = {};
        vm.test_case = {};
        vm.loading   = true;

        graphqlService.get({
            contest: {
                name:     true,
                nickname: true,

                conditions: {
                    contest_nickname: '$contest_nickname'
                }
            },

            problem: {
                name:     true,
                nickname: true,

                conditions: {
                    problem_nickname: '$problem_nickname'
                }
            },

            test_case: {
                id:             true,
                order:          true,
                input:          true,
                output:         true,
                input_text_id:  true,
                output_text_id: true,

                conditions: {
                    test_case_id: '$test_case_id'
                }
            }
        }, {
            contest_nickname: $routeParams.contest_nickname,
            problem_nickname: $routeParams.problem_nickname,
            test_case_id:     +$routeParams.test_case_id
        }).then(function(data) {
            vm.contest   = data.contest[0];
            vm.problem   = data.problem[0];
            vm.test_case = data.test_case[0];

            vm.loading = false;
        });
    };

    vm.loadMore = function(inputType) {
        vm[inputType + 'Loading'] = true;
        graphqlService.get({
            text: {
                text: true,

                conditions: {
                    text_id: '$text_id'
                }
            }
        }, {
            text_id: vm.test_case[inputType + '_text_id']
        }).then(function(data) {
            vm.test_case[inputType] = data.text[0].text;

            vm[inputType + 'Loading'] = false;
            vm[inputType + 'Loaded']  = true;
        });
    };

    vm.init();
    return vm;
}
})();
