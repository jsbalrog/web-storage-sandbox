'use strict';

angular.module('webStorageSandbox', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'main',
  'storage',
	'angular-momentjs'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $momentProvider) {
	$momentProvider
	.asyncLoading(true)
	.scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');

  $urlRouterProvider
    .otherwise('/');

  $locationProvider.html5Mode(true);
})
.run(function($window, LocalStorageService) {
		LocalStorageService.doTimestampCheck(1234);
});
