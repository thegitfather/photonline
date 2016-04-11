'use strict';

angular.module('photoboxApp')
  .directive('uploadList', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/upload-list/upload-list.html',
      replace: true,
      link: function(scope, $element, attrs) {

        scope.convertBytesToKB = function(value) {
          return Math.floor(value / 1024);
        };

      }
    };
  });
