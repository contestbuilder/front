(function() {
'use strict';

angular
	.module('front')
	.filter('url', url)
	.filter('myDate', myDate);

/** @ngInject */
function url(urlService) {
	return function(input) {
		var args = [];
		for(var i=1; i<arguments.length; i++) {
			args.push(arguments[i]);
		}

		return urlService.getUrl(input, args);
	};
}

/** @ngInject */
function myDate() {
	return function(input) {
		var currentDate = moment(),
			inputDate   = moment(input);

		if(inputDate.isBefore(currentDate)) {
			var diffInMinutes = currentDate.diff(inputDate, 'minutes', true),
				diffInHours   = currentDate.diff(inputDate, 'hours', true),
				diffInDays    = currentDate.diff(inputDate, 'days', true),
				diffInMonths  = currentDate.diff(inputDate, 'months', true);

			if(diffInMinutes <= 1) {
				return 'agora';
			} else if(diffInHours < 1) {
				return 'à ' + Math.floor(diffInMinutes) + ' minuto' + (diffInMinutes >= 2 ? 's' : '');
			} else if(diffInDays < 1) {
				return 'à ' + Math.floor(diffInHours) + ' hora' + (diffInHours >= 2 ? 's' : '');
			} else if(diffInMonths < 1) {
				return 'à ' + Math.floor(diffInDays) + ' dia' + (diffInDays >= 2 ? 's' : '');
			} else {
				return 'à ' + Math.floor(diffInMonths) + ' mes' + (diffInMonths >= 2 ? 's' : '');
			}
		} else {
		}
	}
}

})();
