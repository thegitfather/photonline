'use strict';

angular.module('photoboxApp')
  .directive('galleryListItem', function () {
    return {
      templateUrl: 'app/gallery/galleryListItem/galleryListItem.html',

      restrict: 'A',
      replace: false,

      link: function (scope, element, attrs) {
        let userlist = scope.$parent.vm.userlist;

        scope.getUsername = function(id) {
          let username = 'unknown user';

          for (var i = 0; i < userlist.length; i++) {
            if (userlist[i].hasOwnProperty("name") && userlist[i]._id === id) {
              return userlist[i].name;
            }
          }
          return username;
        };

      }
    };
  });