'use strict';

angular.module('storage').factory('LawnChairService', function($q) {
	var storage = new Lawnchair({ name: '1234.gemini_items.users' });

	function addUser(currUserId, user) {
		var deferred = $q.defer();
		storage.save(user, function(data) {
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	function getAllUsers(currUserId) {
		var deferred = $q.defer();
		storage.all(function(arr) {
			deferred.resolve(arr);
		});
		return deferred.promise;
	}

	function removeUser(currUserId, user) {
		var deferred = $q.defer();
		storage.remove(user, function(data) {
			console.log(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	function clearUsers(currUserId) {
		var deferred = $q.defer();
		storage.nuke(function(data) {
			console.log(data);
			deferred.resolve(data);
		});
		return deferred.promise;
	}

	return {
		addUser: addUser,
		getAllUsers: getAllUsers,
		removeUser: removeUser,
		clearUsers: clearUsers
	};
});
