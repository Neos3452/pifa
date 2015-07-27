/*global angular */
(function() {
"use strict";
angular.module('LogoutCtrl', ['AccountService']).controller('LogoutController', function($scope, $location, $timeout, Account) {
    $scope.result = '';
    var goHome = function() { $location.path('/'); };
    var timeout = null;

    Account.logout()
           .then(function() {
                $scope.result = 'Logout successful.';
                timeout = $timeout(goHome, 5000);
            }, function() {
                $scope.result = 'Logout failed try again.';
                timeout = $timeout(goHome, 5000);
            });

    $scope.$on('$routeChangeStart', function(){
        if (timeout) {
            $timeout.cancel(timeout);
        }
    });
});
})();
