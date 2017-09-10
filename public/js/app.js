/*global angular */
(function() {
"use strict";
angular.module('app', [
    'ngRoute',
    'appRoutes',
    'AccountCtrl',
    'LogoutCtrl',
    'MainCtrl',
    'NavigatorCtrl',
    'NotFoundCtrl',
    'PlayerCtrl',
    'PlayerService',
    'SigninCtrl',
]);
})();
