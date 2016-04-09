'use strict';

/**
 * Display server responses
 */

angular.module('photoboxApp')
  .directive('fileDropArea', function() {
    return {
      restrict: 'E',
      templateUrl: 'components/file-drop-area/file-drop-area.html',
      replace: true,
      link: function(scope, $element, attrs) {
        var uploader = scope.vm.uploader;
        var $fileInput = $element.find("input");
        $fileInput.css("display", "none");

        scope.uploaderQueueLength = 0;

        console.log("scope:", scope);

        // console.log("scope.form.uploaderQueueLength:", scope.vm.uploaderQueueLength);

        scope.$watch('vm.uploader.queue.length', checkQueueLength);

        $element.on("click", function(e) {
          console.log("$fileInput:", $fileInput);
          $fileInput[0].click();
        });

        function checkQueueLength() {
          scope.uploaderQueueLength = uploader.queue.length;
          console.log("uploader.queue.length:", uploader.queue.length);
        }
      }
    };
  });
