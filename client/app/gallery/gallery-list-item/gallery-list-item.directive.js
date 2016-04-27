'use strict';

angular.module('photonlineApp')
  .directive('galleryListItem', function () {
    return {
      templateUrl: 'app/gallery/gallery-list-item/gallery-list-item.html',
      restrict: 'E',
      replace: true,
      scope: {
        galleryListItem: '='
      },

      link: function (scope, element, attrs) {
        scope.onImgLoad = function(event) {
          scope.imgReady = true;
        };
      }
    };
  });
