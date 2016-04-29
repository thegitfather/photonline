'use strict';

angular.module('photonlineApp')
  .directive('galleryItem', function() {
    return {
      templateUrl: 'app/gallery/gallery-item/gallery-item.html',
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
            template: 'app/gallery/gallery-item/photo.template.html',
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

        scope.onThumbImgLoad = function(event) {
          scope.thumbImgReady = true;
        };

        scope.onPoolImgLoad = function(event) {
          scope.poolImgReady = true;
          var $img = angular.element(event.target);
          var $ngContent = $img.parent().parent();
          var ratio = $img[0].naturalWidth / $img[0].naturalHeight;
          var temp;

          setTimeout(setWidth, 100);
          function setWidth() {
            $ngContent.css("height", "auto");
            temp = document.documentElement.clientHeight / $ngContent[0].clientHeight;
            temp = temp * $ngContent[0].clientWidth;
            $ngContent.css("width", temp + "px");
            if (temp > $img[0].naturalWidth) {
              $ngContent.css("width", $img[0].naturalWidth + "px");
            } else {
              $ngContent.css("width", temp + "px");
            }
          }
        };

      }
    };
  });
