/*global angular */
(function() {
"use strict";
angular.module('SigninCtrl', ['AccountService']).controller('SigninController', function($scope, $location, Account) {
    $scope.register = {};
    $scope.login = {};

    $scope.registerSubmit = function() {
        console.log('register submit ' + JSON.stringify($scope.register));
        Account.register($scope.register.username, $scope.register.password, $scope.register.team)
            .then(function () {
                $location.path('/');
            }, function () {
                console.warn('Could not register!');
            });
    };

    $scope.loginSubmit = function() {
        console.log('login submit ' + JSON.stringify($scope.login));
        Account.login($scope.login.username, $scope.login.password)
            .then(function() {
                    $location.path('/');
                }, function() {
                    console.warn('Could not Log in!');
                });
    };
});
})();
