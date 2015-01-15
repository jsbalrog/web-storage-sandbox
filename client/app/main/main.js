'use strict';

angular.module('main', []).config(function ($stateProvider) {
	$stateProvider
		.state('main', {
			url: '/',
			templateUrl: 'app/main/main.html',
			controller: 'MainCtrl'
		});
});
