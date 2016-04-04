'use strict';

angular.module('photoboxApp')
  .controller('GalleryController', ['$scope', 'User', 'userlist', 'Gallery', function ($scope, User, userlist, Gallery) {
    var vm = this;

    vm.galleries = [];
    vm.userlist = userlist;

    Gallery.query(function(data) {
      vm.galleries = data;
    });

  }]);
