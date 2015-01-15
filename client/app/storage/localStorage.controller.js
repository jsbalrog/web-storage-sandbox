'use strict';

angular.module('storage').controller('LocalStorageCtrl', function (LocalStorageService) {
  var ls = this;
  var currUserId = 1234; // fake id for currently logged in user
  ls.alerts = [];

  ls.addUserToLocalStorage = function(user) {
    LocalStorageService.addUser(currUserId, user).then(function success(data) {
        ls.alerts.push({ type: 'success', msg: 'Successfully saved to local storage' });
        ls.updateUserList();
        ls.user = null;
    }, function failure() {
      ls.alerts.push({ type: 'danger', msg: 'Save to local storage not successful' });
    });
  };

  ls.removeUser = function(user) {
    LocalStorageService.removeUser(currUserId, user).then(function success(data) {
      ls.alerts.push({ type: 'success', msg: 'Successfully deleted user' });
      ls.updateUserList();
      ls.user = null;
    }, function failure(data) {
      ls.alerts.push({ type: 'danger', msg: 'Unable to delete user' });
    });
  };

  ls.closeAlert = function(index) {
    ls.alerts.splice(index, 1);
  };

  ls.clearUserTable = function() {
    var retVal = LocalStorageService.clearTable('users', currUserId);
    if(retVal) {
      ls.alerts.push({ type: 'success', msg: 'Successfully deleted user table' });
      ls.updateUserList();
    } else {
      ls.alerts.push({ type: 'danger', msg: 'Unable to delete user table' });
    }
  };

  ls.updateUserList = function() {
    LocalStorageService.getTable('users', currUserId).then(function success(data) {
      ls.users = data;
    });
  };

  ls.updateUserList();
});
