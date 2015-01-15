'use strict';

angular.module('storage').controller('LawnChairCtrl', function(LawnChairService) {
	var lc = this;
	var currUserId = 1234; // fake id for currently logged in user
	lc.alerts = [];
	lc.userList = []

	lc.addUser = function(user) {
		LawnChairService.addUser(currUserId, user).then(function(data) {
			lc.alerts.push({ type: 'success', msg: 'Save successful' });
			lc.userList.push(data);
			lc.user = null;
		});
	};

	lc.closeAlert = function(index) {
		lc.alerts.splice(index, 1);
	};

	lc.getAllUsers = function() {
		LawnChairService.getAllUsers(currUserId).then(function success(data) {
			lc.userList = data;
		});
	};

	lc.removeUser = function(user) {
		LawnChairService.removeUser(currUserId, user).then(function success(data) {
			lc.userList.splice(data, 1);
			lc.alerts.push({ type: 'success', msg: 'Delete successful' });
		});
	};

	lc.clearUsers = function() {
		LawnChairService.clearUsers(currUserId).then(function(data) {
			lc.alerts.push({ type: 'success', msg: 'Nuke successful' });
			lc.userList = [];
		});
	};

	lc.getAllUsers();

});
