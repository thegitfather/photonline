'use strict';

angular.module('photoboxApp')
  .controller('GalleryController', ['$scope', 'userlist', 'Gallery', function ($scope, userlist, Gallery) {
    var vm = this;

    vm.galleries = [];

    Gallery.query().$promise.then(function(data) {
      vm.galleries = data;
      vm.galleries.forEach(function(value, index) {
        vm.galleries[index].user_name = getUsername(vm.galleries[index].user_id);
      });
    });

    function getUsername(id) {
      var username = 'unknown_user';

      for (var i = 0; i < userlist.length; i++) {
        if (userlist[i].hasOwnProperty("name") && userlist[i]._id === id) {
          return userlist[i].name;
        }
      }
      return username;
    }

  }]);
