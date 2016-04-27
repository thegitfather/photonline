'use strict';

/**
 * Usage:
 * Template: <img po-on-load="onImgLoad($event)" ...>
 * Controller/Directive: scope.onImgLoad = function(event) { ... };
 */

angular.module('photonlineApp')
  .directive('poOnLoad', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        var fn = $parse(attrs.poOnLoad);
        elem.on('load', function (event) {
          scope.$apply(function() {
            fn(scope, { $event: event });
          });
        });
      }
    };
  }]);
