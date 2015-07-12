/*jslint jasmine:true, angular:true*/
/*global module, inject */

describe('AccountController', function() {
  beforeEach(module('AccountCtrl'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('tagline', function() {
    it('equals to set string', function() {
      var $scope = {};
      var controller = $controller('AccountController', { $scope: $scope });
      expect($scope.tagline).toEqual('Register, Log ins, Log out!');
    });
  });
});
