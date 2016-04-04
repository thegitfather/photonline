'use strict';

angular.module('photoboxApp')
  .directive('pageHeader', () => ({
    templateUrl: 'components/page-header/page-header.html',
    restrict: 'E',
    controller: 'PageHeaderController',
    controllerAs: 'nav',
    replace: true
  }));
