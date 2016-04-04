'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('photoboxApp')
  .directive('serverResponses', function() {
    return {
      restrict: 'C',
      replace: false,
      link: function(scope, element, attrs) {
        // console.log("scope.vm.serverResponses:", scope.vm.serverResponses);
        element.css('display', 'none');

        scope.$watchCollection('vm.serverResponses', function(responses) {
          element.empty();

          responses.forEach(function(curVal) {
            var msgElement = angular.element("<div class='notification' />");
            msgElement.text(curVal.message);
            msgElement.addClass(curVal.classes);
            element.append(msgElement);
          });

          if (responses.length > 0) {
            element.fadeIn();
          }
        });
      }
    };
  });
