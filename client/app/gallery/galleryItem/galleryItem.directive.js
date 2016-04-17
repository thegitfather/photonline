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



        element.on("click", function(e) {
          // var body = angular.element(document).find('html');
          // console.log(window.innerHeight);
          scope.windowHeight = window.innerHeight;
          ngDialog.open({
            template: 'app/gallery/galleryItem/photo.template.html',
            scope: scope,
            className: 'ngdialog-theme-photobox'
          });
        })
      }
    };
  });
