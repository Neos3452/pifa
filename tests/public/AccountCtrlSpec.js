/*jslint jasmine:true, angular:true*/
/*global module, inject */

describe('AccountController', function () {
    "use strict";

    let $controller;

    beforeEach(module('AccountCtrl'));
    beforeEach(inject(function (_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    describe('userdata', function () {
        const userData = {username:"Dumb user name", team:"Example team"};

        it('is same as in account data', function () {
            var $scope = {};
            var controller = $controller('AccountController', {
                $scope: $scope,
                Account:{data:{currentUser:userData}}
            });
            expect($scope.username).toEqual(userData.username);
            expect($scope.userteam).toEqual(userData.team);
        });
    });
});
