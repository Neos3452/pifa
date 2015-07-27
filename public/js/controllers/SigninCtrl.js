/*global angular */
(function() {
"use strict";
angular.module('SigninCtrl', ['AccountService']).controller('SigninController', function($scope, $location, Account) {
    $scope.register = {};
    $scope.login = {};

    $scope.registerSubmit = function() {
        console.log("register submit " + JSON.stringify($scope.register));
    };

    $scope.loginSubmit = function() {
        console.log("login submit " + JSON.stringify($scope.login));
        Account.login($scope.login.username, $scope.login.password)
            .then(function() {
                    $location.path('/');
                }, function() {
                    console.log('error loging in');
                });
    };
});
})();
