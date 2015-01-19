angular.module('storage').factory('$db', function() {
	PouchDB.enableAllDbs = true;
	var localDb = new PouchDB('gemini_items_users');
	var remoteDb = 'http://localhost:5984/gemini_items_users_1234';
	var options = {live: true};
	var syncError = function() {
		console.log('Problem encountered during database synchronization');
	}

	console.log('Replicating from local to server');
	localDb.replicate.to(remoteDb, options, syncError);

	console.log('Replicating from server back to local');
	localDb.replicate.from(remoteDb, options, syncError);

	return localDb;
});

angular.module('storage').factory("PouchdbService", function($q, $db) {

	function addUser(currUserId, user) {
		var deferred = $q.defer();

		return $db.post(user);
	}

	function getAllUsers(currUserId) {
		var deferred = $q.defer(),
				retVal = [];

		$db.allDocs({ include_docs: true, descending: true}, function(err, res) {
			if(err) {
				deferred.reject(err);
			} else {
				console.log(res.rows);
				res.rows.forEach(function(row) {
					retVal.push(row.doc);
				})
				deferred.resolve(retVal);
			}
		});
		return deferred.promise;
	}

	function removeUser(currUserId, user) {
		return $db.remove(user);
	}

	return {
		addUser: addUser,
		getAllUsers: getAllUsers,
		removeUser: removeUser
	};
});
