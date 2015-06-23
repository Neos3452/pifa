/*global angular */
(function() {
"use strict";
angular.module('PlayerService', []).factory('Player', ['$http', function($http) {

    return {
        // call to get all nerds
        get : function() {
            return $http.get('/api/players');
        },


                // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new player
        create : function(nerdData) {
            return $http.post('/api/players', nerdData);
        },

        // call to DELETE a nerd
        delete : function(id) {
            return $http.delete('/api/players/' + id);
        }
    };

}]);
})();
