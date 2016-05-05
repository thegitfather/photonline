'use strict';

angular.module('photonlineApp')
  .directive('galleryItem', function() {
    return {
      templateUrl: 'app/gallery/gallery-item/gallery-item.html',
      restrict: 'E',
      replace: true,

      link: function (scope, element, attrs) {
        element.attr("id", "gallery-item-" + scope.photo.position);

        scope.onThumbImgLoad = function(event) {
          scope.thumbImgReady = true;
        };

        // trigger ngDialog after last gallery-item is loaded
        if (scope.$last) {
          scope.$parent.vm.checkUrlQueryParam();
        }
      }
    };
  });
