'use strict';

describe('Directive: galleryListItem', function () {

  // load the directive's module and view
  beforeEach(module('photonlineApp'));
  beforeEach(module('app/gallery/galleryListItem/galleryListItem.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<gallery-list-item></gallery-list-item>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the galleryListItem directive');
  }));
});
