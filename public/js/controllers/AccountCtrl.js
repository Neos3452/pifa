/*global angular */
(function() {
"use strict";
angular.module('AccountCtrl', ['AccountService']).controller('AccountController', function($scope, Account) {
    $scope.username = Account.data.currentUser.username;
    $scope.userteam = Account.data.currentUser.team;
});
})();
