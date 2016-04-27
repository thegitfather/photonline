'use strict';

angular.module('photonlineApp')
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
            className: 'ngdialog-theme-photonline'
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

        scope.onImgLoad = function(event) {
          // console.log("event:", event);
          var $img = angular.element(event.target);
          var $ngContent = $img.parent().parent();
          var ratio = $img[0].naturalWidth / $img[0].naturalHeight;
          var temp;

          // console.log("$img:", $img);
          // console.log("ratio:", ratio);

          $img.css("opacity", "1");

          // TODO: fix calculation
          if (ratio < 1 || ratio >= 1) {
            $ngContent.css("height", "auto");
            temp = document.documentElement.clientHeight / $ngContent[0].clientHeight;
            temp = temp * $ngContent[0].clientWidth;
            if ($img[0].naturalWidth > temp) {
              $ngContent.css("width", temp + "px");
            } else {
              $ngContent.css("width", $img[0].naturalWidth + "px");
            }
          }

          scope.imgReady = true;
        };

      }
    };
  });
