'use strict';

angular.module('photoboxApp')
  .controller('GalleryShowController', ['$scope', '$stateParams', 'Gallery', 'Photo', function ($scope, $stateParams, Gallery, Photo) {
    var vm = this;
    vm.photos = [];

    Gallery.get({ id: $stateParams.id }, function(data) {
      vm.photos = data.photo_ids; // holds just the photo IDs for now

      vm.photos.map(function(curVal) {
        Photo.get({ id: curVal }, function(data) {
          vm.photos.push(data); // push complete photo object
          vm.photos.shift(); // remove first array element
        });
      });

    });

  }]);
