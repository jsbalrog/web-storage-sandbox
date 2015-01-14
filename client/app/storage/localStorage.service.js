'use strict';

angular.module('storage').factory('LocalStorageService', function($q, $window) {
  var lsKey = 'gemini_items',
      tableKey,
      localStorage = $window.localStorage;

  function addUser(userId, user) {
    var newItem,
        ns,
        userItems = [],
        deferred = $q.defer();

    ns = getLocalStorageNamespace(userId, 'users');

    if(ns) {
      if(!isInTable('users', userId, user._id)) {
        newItem = {
          id: user._id,
          name: user.name,
          address: user.address,
          email: user.email,
          gender: user.gender
        };
        userItems = JSON.parse(localStorage[ns]);
        userItems.push(newItem);
        localStorage.setItem(ns, JSON.stringify(userItems));
        deferred.resolve(userItems);
      } else {
        // Already in user table. Modify existing
        updateUser(userId, user);
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
          if(user._id === items[i].id) {
            items[i] = user;
            localStorage.setItem(ns, JSON.stringify(items));
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
          localStorage.setItem(ns, JSON.stringify(newItems));
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

    if (localStorage) {
      if (!localStorage[fullKey]) {
        // create a new localstorage namespace
        localStorage[fullKey] = JSON.stringify([]);
      }
      retVal = fullKey;
    }
    return retVal;
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
    addUser: addUser,
    updateUser: updateUser,
    removeUser: removeUser,
    clearTable: clearTable,
    getTable: getTable
  };
});
