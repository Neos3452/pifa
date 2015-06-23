/*global angular */
(function() {
"use strict";
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })

        // players page that will use the PlayerController
        .when('/players', {
            templateUrl: 'views/player.html',
            controller: 'PlayerController'
        });

    $locationProvider.html5Mode(true);

}]);
})();
