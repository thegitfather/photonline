'use strict';

angular.module('photoboxApp')
  .directive('galleryItem', function() {
    return {
      templateUrl: 'app/gallery/galleryItem/galleryItem.html',
      restrict: 'E',
      replace: true,
      // scope: {
      //   galleryListItem: '='
      // },

      link: function (scope, element, attrs) {
        var ngDialog = scope.$parent.vm.ngDialog;
        scope.windowHeight = window.innerHeight;

        element.find("a").on("click", function(e) {
          ngDialog.closeAll();

          scope.nextElement = document.getElementById( "gallery-item-" + parseInt(scope.$index + 1) );
          scope.prevElement = document.getElementById( "gallery-item-" + parseInt(scope.$index - 1) );

          ngDialog.open({
            template: 'app/gallery/galleryItem/photo.template.html',
            scope: scope,
            className: 'ngdialog-theme-photobox'
          });
        });

        scope.openNext = function() {
          if (scope.nextElement !== null) {
            angular.element(scope.nextElement).find("a")[0].click();
          }
        };

        scope.openPrev = function() {
          if (scope.prevElement !== null) {
            angular.element(scope.prevElement).find("a")[0].click();
          }
        };

      }
    };
  });
