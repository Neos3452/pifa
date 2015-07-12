/*global angular */
(function() {
"use strict";
angular.module('AccountService', []).service('Account', ['$http', function($http) {
    this.login = function(username, password) {
        return $http.get('/login', username, password);
    };

    this.logout = function() {
        return $http.post('/logout');
    };
}]);
})();
