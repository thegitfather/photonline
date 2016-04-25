'use strict';

angular.module('photonlineApp')
  .directive('galleryListItem', function () {
    return {
      templateUrl: 'app/gallery/galleryListItem/galleryListItem.html',
      restrict: 'E',
      replace: true,
      scope: {
        galleryListItem: '='
      },

      link: function (scope, element, attrs) {

      }
    };
  });
