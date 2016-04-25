'use strict';

angular.module('photonlineApp')
  .directive('pageHeader', () => ({
    templateUrl: 'components/page-header/page-header.html',
    restrict: 'E',
    controller: 'PageHeaderController',
    controllerAs: 'nav',
    replace: true
  }));
