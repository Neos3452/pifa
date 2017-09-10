/*global angular */
(function() {
"use strict";
angular.module('AccountService', []).service('Account', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
    const data = {
        loginStatus: false,
        lastChecked: Date.now(),
        kLoggedCheckTimeout: 1 * 60 * 60 * 1000, // 1 hour
    };

    const changeLoginStatus = function (newValue) {
        data.loginStatus = newValue;
        data.lastChecked = Date.now();
//        if (loginStatus !== oldStatus) {
//            $rootScope.$broadcast('loginStatusChanged', loginStatus);
//        }
    };

    const login = function(username, password) {
        return $http.post('/api/login', {username: username, password:password})
            .then(function() {
                    console.log('ok');
                    changeLoginStatus(true);
                }, function() {
                    console.log('not');
                    changeLoginStatus(false);
                    return $q.reject();
                });
    };

    const logout = function() {
        return $http.post('/api/logout')
            .then(function() {
                changeLoginStatus(false);
            }, function() {
                // Probably there is no connection to the server so it must
                // be assumed that server did not get the request
                return $q.reject();
            });
    };

    const logged = function() {
        // Check whether the cache has expired and if so make the request
        if (Date.now() - data.lastChecked < data.kLoggedCheckTimeout) {
            return $http.get('/api/logged')
                .then(function() {
                    changeLoginStatus(true);
                }, function() {
                    changeLoginStatus(false);
                    return $q.reject();
                });
        } else {
            if (data.loginStatus) {
                return $q.when();
            } else {
                return $q.reject();
            }
        }
    };

    const register = function(username, password) {
        return $http.post('/api/register', {username: username, password: password})
            .then(function() {
                changeLoginStatus(true);
            }, function(status) {
                return $q.reject({reason: status === 400 ? 'input' : 'internal'});
            });
    };

    // check status on init
    logged();

    return {
        login: login,
        logout: logout,
        logged: logged,
        register: register,
        data: data
    };
}]);
})();
