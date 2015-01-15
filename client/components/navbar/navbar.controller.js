'use strict';

angular.module('webStorageSandbox')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
      {
        'title': 'Home',
        'link': '/'
      },
      {
        'title': 'Local Storage',
        'link': '/local-storage'
      },
			{
				'title': 'Lawn Chair',
				'link': '/lawn-chair'
			},
			{
				'title': 'PouchDB',
				'link': '/pouchdb'
			}
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
