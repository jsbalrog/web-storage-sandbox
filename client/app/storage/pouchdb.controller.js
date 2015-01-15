angular.module('storage').controller('PouchdbCtrl', function(PouchdbService) {
	var pdb = this;
	var currUserId = 1234; // fake id for currently logged in user
	pdb.alerts = [];
	pdb.userList = []

	pdb.closeAlert = function(index) {
		pdb.alerts.splice(index, 1);
	};

	pdb.addUser = function(user) {
		PouchdbService.addUser(currUserId, user).then(function success(data) {
			console.log(data);
			pdb.getAllUsers();
		}, function error(err) {
			console.log(err);
		});
	};

	pdb.getAllUsers = function() {
		PouchdbService.getAllUsers(currUserId).then(function success(data) {
			pdb.userList = data;
		}, function error(err) {
			console.log(err);
		});
	};

	pdb.getAllUsers();
});
