'use strict';

angular.module('storage').factory('LocalStorageService', function($q, $window, $moment) {
  var lsKey = 'gemini_items',
      tableKey,
      localStorage = $window.localStorage;

	function doTimestampCheck(userId) {
		var ns = getLocalStorageNamespace(userId, 'sync');
		if(!isDirty(ns)) {
			$moment.then(function(moment) {
				localStorage[ns] = JSON.stringify({ 'timestamp': moment().unix(), 'dirty': true });
			});
		}
	}

	function isDirty(ns) {
		return JSON.parse(localStorage.getItem(ns)).dirty;
	}

  function addUser(userId, user) {
    var newItem,
        ns,
        userItems = [],
        deferred = $q.defer();

    ns = getLocalStorageNamespace(userId, 'users');

    if(ns) {
      if(!isInTable('users', userId, user.id)) {
        newItem = {
          id: user.id,
          name: user.name,
          address: user.address,
          email: user.email,
          gender: user.gender
        };
        userItems = JSON.parse(localStorage[ns]);
        userItems.push(newItem);
        localStorage[ns] = JSON.stringify(userItems);
        deferred.resolve(userItems);
      } else {
        // Already in user table. Modify existing
        updateUser(userId, user);
				deferred.resolve(user);
      }
    } else {
      deferred.reject('Bummer. HTML5 local storage not supported.');
    }
    return deferred.promise;
  }

  function updateUser(userId, user) {
    var ns = getLocalStorageNamespace(userId, 'users');
    if(ns) {
      getTable('users', userId).then(function(items) {
        for(var i = 0; i < items.length; i++) {
          if(user.id === items[i].id) {
            items[i] = user;
            localStorage[ns] = JSON.stringify(items);
          }
        }
      });
    }
  }

  function removeUser(userId, user) {
    var ns,
    deferred = $q.defer(),
    userItems = [],
    newItems = [];
    ns = getLocalStorageNamespace(userId, 'users');
    if(ns) {
      if(isInTable('users', userId, user.id)) {
        userItems = JSON.parse(localStorage[ns]);
        newItems = _.filter(userItems, function(item) {
          return item.id !== user.id;
        });
        if(newItems.length < 1) {
          localStorage.removeItem(ns);
        } else {
          localStorage[ns] = JSON.stringify(newItems);
        }
        deferred.resolve(newItems);
      }
    } else {
      deferred.reject('Bummer. HTML5 local storage not supported.');
    }
    return deferred.promise;
  }

  function getLocalStorageNamespace(userId, table) {
    var retVal;
    tableKey = table;
    var fullKey = userId + '.' + lsKey + '.' + tableKey;

		try {
			if ('localStorage' in $window && localStorage) {
				if (!localStorage[fullKey]) {
					// create a new localstorage namespace
					localStorage[fullKey] = JSON.stringify([]);
					localStorage['storage'] = '';
					localStorage.removeItem('storage');
				}
				retVal = fullKey;
			}
			return retVal;
		} catch(err) {
			return null;
		}
  }

  function isInTable(table, userId, id) {
    var retVal,
    ns = getLocalStorageNamespace(userId, table),
    allItems = [],
    matchingItems = [];
    if (ns) {
      retVal = false;
      allItems = JSON.parse(localStorage[ns]);
      if (allItems.length > 0) {
        angular.forEach(allItems, function(item) {
          if (item.id === id) {
            matchingItems.push(item);
          }
        });
        retVal = matchingItems.length > 0;
      }
    }
    return retVal;
  }

  function clearTable(table, userId) {
    var retVal = false,
    ns = getLocalStorageNamespace(userId, table);
    if(ns) {
      localStorage.removeItem(ns);
      retVal = true;
    }

    return retVal;
  }

  function getTable(table, userId) {
    var items = [],
    ns = getLocalStorageNamespace(userId, table),
    deferred = $q.defer();
    if (ns) {
      items = JSON.parse(localStorage[ns]);
      deferred.resolve(items);
    } else {
      deferred.reject('Bummer. HTML5 local storage not supported.');
    }
    return deferred.promise;
  }


  return {
		doTimestampCheck: doTimestampCheck,
    addUser: addUser,
    updateUser: updateUser,
    removeUser: removeUser,
    clearTable: clearTable,
    getTable: getTable
  };
});
