angular.module('storage', [])
.config(function ($stateProvider) {
  $stateProvider
  .state('local-storage', {
    url: '/local-storage',
    templateUrl: 'app/storage/local-storage.html',
    controller: 'LocalStorageCtrl',
    controllerAs: 'ls'
  });
});
