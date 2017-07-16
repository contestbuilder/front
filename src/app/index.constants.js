/* global moment:false */
(function() {
'use strict';

angular
    .module('front')
    .constant('moment', moment)
    .constant('PromiseProcess', promiseProcess)
    .constant('apiUrl', 'http://localhost:3010/api/v1/')
    .constant('languages', languages())
    .constant('verdicts', verdicts())
    .constant('frontUrls', frontUrls());

// list of languages
function languages() {
	return [{
		label: 'Outra',
		value: 'other'
	}, {
		label: 'C++',
		value: 'cpp'
	}, {
		label: 'C',
		value: 'c'
	}];
}

// list of verdicts
function verdicts() {
	return [{
		label: 'Other',
		short: 'Other',
		value: 'Other'
	}, {
		label: 'Accepted',
		short: 'AC',
		value: 'Accepted'
	}, {
		label: 'Presentation error',
		short: 'PE',
		value: 'Presentation error'
	}, {
		label: 'Wrong answer',
		short: 'WA',
		value: 'Wrong answer'
	}, {
		label: 'Time limit exceeded',
		short: 'TLE',
		value: 'Time limit exceeded'
	}, {
		label: 'Compilation error',
		short: 'CE',
		value: 'Compilation error'
	}];
}

// list of urls
function frontUrls() {
	var paramKeys = {
		user:        'user_nickname',
		contest:     'contest_nickname',
		problem:     'problem_nickname',
		solution:    'solution_nickname',
		testCase:    'test_case_id',
		solutionRun: 'run_number'
	};

	var urls = {
		main:  '/',
		login: '/login',
		log:   '/logs',
		user:  {
			new:  '/users/new',
			view: '/users/:user_nickname',
			list: '/users'
		},
		contest: {
			new:  '/contests/new',
			view: '/contests/:contest_nickname',
			list: '/contests',

			contributor: {
				new: '/contests/:contest_nickname/contributors/new'
			},

			problem: {
				new:  '/contests/:contest_nickname/problems/new',
				view: '/contests/:contest_nickname/problems/:problem_nickname',
				edit: '/contests/:contest_nickname/problems/:problem_nickname/edit',

				solution: {
					new:  '/contests/:contest_nickname/problems/:problem_nickname/solutions/new',
					view: '/contests/:contest_nickname/problems/:problem_nickname/solutions/:solution_nickname',
					edit: '/contests/:contest_nickname/problems/:problem_nickname/solutions/:solution_nickname/edit',

					run: {
						list: '/contests/:contest_nickname/problems/:problem_nickname/solutions/:solution_nickname/runs',
						view: '/contests/:contest_nickname/problems/:problem_nickname/solutions/:solution_nickname/runs/:run_number'
					}
				},

				testCase: {
					new:  '/contests/:contest_nickname/problems/:problem_nickname/test_cases/new',
					view: '/contests/:contest_nickname/problems/:problem_nickname/test_cases/:test_case_id',
					edit: '/contests/:contest_nickname/problems/:problem_nickname/test_cases/:test_case_id/edit'
				},

				solutionRun: {
					list: '/contests/:contest_nickname/problems/:problem_nickname/solution_runs',
					view: '/contests/:contest_nickname/problems/:problem_nickname/solution_runs/:run_number'
				}
			}
		}
	};

	return {
		paramKeys: paramKeys,
		urls:      urls
	};
}

})();
