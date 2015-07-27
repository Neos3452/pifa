/*global angular */
(function() {
"use strict";
angular.module('NavigatorCtrl', ['AccountService']).controller('NavigatorController', ['$scope', 'Account', function($scope, account) {
    var self = this;
    self.pages = [
            { url: '/players', title: 'Players' },
        ];
    self.loggedIn = false;

    var beginLength = self.pages.length;

    $scope.$watch(function(){ return account.data.loginStatus; }, function(newVal, oldVal) {
        console.log('Changed to ' + newVal + ' from ' + oldVal);
        if (newVal !== null) {
            self.loggedIn = newVal;
            if (beginLength < self.pages.length) {
                self.pages.pop();
            }
            if (newVal) {
                self.pages.push({ url: '/account', title: 'Account' });
                self.pages.push({ url: '/logout', title: 'Log out' });
            } else {
                if (beginLength < self.pages.length) {
                    self.pages.pop();
                }
                self.pages.push({ url: '/signin', title: 'Sign in' });
            }
        }
    });
}]);
})();
