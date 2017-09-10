/*global angular */
(function() {
"use strict";
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

$routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    })
    .when('/players', {
        templateUrl: 'views/player.html',
        controller: 'PlayerController'
    })
    .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountController'
    })
    .when('/signin', {
        templateUrl: 'views/signin.html',
        controller: 'SigninController'
    })
    .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutController'
    })
    .otherwise({
        templateUrl: 'views/404.html',
        controller: 'NotFoundController'
    });

$locationProvider.html5Mode(true);

}]);
})();
