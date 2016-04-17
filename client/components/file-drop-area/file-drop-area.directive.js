'use strict';

angular.module('photoboxApp')
  .directive('fileDropArea', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/file-drop-area/file-drop-area.html',
      replace: true,
      scope: {
        'files': '=',
        'form': '=',
        'queueInvalidLength': '@'
      },
      link: function(scope, $element, attrs) {
        var $fileInput = $element.find("input");
        $fileInput.css("display", "none");

        $element.on("click", function(e) {
          $fileInput[0].click();
        });
      }
    };
  });
