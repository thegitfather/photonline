'use strict';

angular.module('photoboxApp')
  .controller('GalleryController', ['$scope', 'Gallery', 'User', function ($scope, Gallery, User) {
    var vm = this;

    vm.galleries = [];

    Gallery.query().$promise.then(function(data) {
      vm.galleries = data;
      vm.galleries.forEach(function(value, index) {
        User.get({id: vm.galleries[index].user_id}).$promise.then(function(user) {
          vm.galleries[index].user_name = user.name;
        });
      });
    });

  }]);
