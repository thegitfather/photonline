'use strict';

angular.module('photoboxApp')
  .directive('fileDropArea', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/file-drop-area/file-drop-area.html',
      replace: true,
      link: function(scope, $element, attrs) {
        var $fileInput = $element.find("input");
        $fileInput.css("display", "none");

        $element.on("click", function(e) {
          console.log("$fileInput:", $fileInput);
          $fileInput[0].click();
        });
      }
    };
  });
