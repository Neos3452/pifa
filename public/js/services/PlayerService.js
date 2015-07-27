/*global angular */
(function() {
"use strict";
angular.module('PlayerService', []).factory('Player', ['$http', '$q', function($http, $q) {
    return {
        get : function() {
            return $http.get('/api/players')
                        .then(function(status, data) {
                                return data;
                            }, function() {
                                $q.reject(new Error('Could not get players'));
                            });
        },
    };

}]);
})();
