'use strict';

angular.module('photoboxApp')
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
