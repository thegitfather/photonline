'use strict';

angular.module('photoboxApp')
  .directive('uploadList', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/upload-list/upload-list.html',
      replace: true,
      scope: {
        'upload': '=',
        'files': '=',
        'invalidFiles': '='
      },
      link: function(scope, $element, attrs) {

        scope.$watch('upload', function(newValue, oldValue) {
          console.log("newValue:", newValue);
        });

        // TODO: add to global helper functions?
        scope.convertBytesToKB = function(value) {
          return Math.floor(value / 1024);
        };

        scope.removeFile = function(index) {
          scope.files.splice(index, 1);
        };

      }
    };
  });
